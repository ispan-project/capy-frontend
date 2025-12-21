import { defineStore } from "pinia";
import { markAllFailed, markUploadComplete, markUploadFailed } from "@/api/teacher/video";
import axios from "axios";
export const useVideoStore = defineStore("videoStore", () => {
  const uploadingVideoList = ref([]);
  const append = (id) => {
    uploadingVideoList.value.push(id);
  };
  const remove = (videoAssetId) => {
    uploadingVideoList.value = uploadingVideoList.value.filter(
      (vid) => vid.videoAssetId !== videoAssetId
    );
  };
  ////
  // findUploadingProgress
  // checkIsPause
  // checkUploadingStatus
  // {
  //   lessonId,
  //   videoId,
  //   fileName,
  //   fileSize,
  //   sessionUri,
  //   uploadedBytes,
  //   progressPersent,
  //   AbortController,
  //   file,
  //   isUploading,
  // }
  //待上傳列表
  const uploadingTasks = ref([]);
  //正在上傳數量
  const MAX_UPLOADING_COUNT = ref(3);
  const CHUNK_SIZE = 1024 * 1024 * 5;
  const currentUploadingCount = computed(
    () => uploadingTasks.value.filter((task) => task.isUploading).length
  );
  const ableUpload = computed(() => currentUploadingCount.value < MAX_UPLOADING_COUNT.value);
  //獲取後端的signedurl(省略)
  //跟gcp交換sessionuri
  const initializeUpload = async (initiateURL) => {
    try {
      const res = await axios.post(initiateURL, null, {
        headers: {
          "x-goog-resumable": "start",
        },
      });
      return res.headers.location;
    } catch (e) {
      console.log(e);
      throw new Error("fail to get sessionuri");
    }
  };
  //查詢gcs上傳進度
  const getGcsUploadBytes = async (sessionUri) => {
    try {
      const res = await axios.put(sessionUri, null, {
        headers: {
          // "Content-Length": 0,
          "Content-Range": `bytes */*`,
        },
        validateStatus: (status) => status === 200 || status === 201 || status === 308,
      });
      if (res.status === 308) {
        const rangeHeader = res.headers.range;
        if (rangeHeader) {
          const endByte = parseInt(rangeHeader.split("-")[1]);
          return endByte + 1;
        }
      } else if (res.status === 200 || res.status === 201) {
        return res.config.headers["X-Upload-Content-Length"] || 0;
      }
      return 0;
    } catch (e) {
      if (e.response && (e.response.status === 404 || e.response.status === 410)) {
        return -1;
      }
      throw e;
    }
  };
  //開始分片上傳
  const uploadChunkLoop = async (task) => {
    task.isUploading = true;
    task.abortController = new AbortController();
    // const CHUNK_SIZE = 5 * 1024 * 1024;
    const totalSize = task.fileSize;
    let startByte = task.uploadedBytes;
    if (startByte > 0) {
      const gcsBytes = await getGcsUploadBytes(task.sessionURI);
      if (gcsBytes === -1) {
        startByte = 0;
        throw new Error("sessionUri失效");
      } else if (gcsBytes > startByte) {
        startByte = gcsBytes;
      }
    }
    task.uploadedBytes = startByte;
    while (task.uploadedBytes < totalSize) {
      if (!task.isUploading || task.abortController.signal.aborted) {
        console.log(1234);
        break;
      }
      const start = task.uploadedBytes;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      // const chunkEnd = Math.min(offset + CHUNK_SIZE, totalSize);
      const chunk = task.file.slice(start, end);
      const contentRange = `bytes ${start}-${end - 1}/${totalSize}`;
      // const chunkLength = end - start;
      try {
        const res = await axios.put(task.sessionURI, chunk, {
          headers: {
            // "Content-Length": chunkLength,
            "Content-Range": contentRange,
          },
          validateStatus: (status) =>
            // 接受 200, 201 (表示上傳完成) 和 308 (表示分塊成功)
            status === 200 || status === 201 || status === 308,
          onUploadProgress: (progressEvent) => {
            // const chunkProgress = progressEvent.loaded/progressEvent.total
            const overallProgressBytes = start + progressEvent.loaded;
            const progress = (overallProgressBytes / totalSize) * 100;
            task.progressPersent = progress.toFixed(1);
            console.log(task.progressPersent);
          },
        });
        if (res.status === 308) {
          const rangeHeader = res.headers.range;
          if (rangeHeader) {
            const newEndByte = parseInt(rangeHeader.split("-")[1]);
            task.uploadedBytes = newEndByte + 1;
            console.log(newEndByte);
          } else {
            task.uploadedBytes = end;
            console.log(end);
          }
          task.progressPersent = ((task.uploadedBytes / totalSize) * 100).toFixed(1);
          console.log(task.progressPersent);
        } else if (res.status === 200 || res.status === 201) {
          task.uploadedBytes = totalSize;
          task.progressEvent = 100;
          await markUploadComplete(task.videoId);
          uploadingTasks.value = uploadingTasks.value.filter(
            (item) => item.videoId !== task.videoId
          );
          ElMessage.success("影片上傳成功");
          await courseStore.fetchCourseOverview();
          task.isUploading = false;
          //startNextTask
          break;
        }
      } catch (e) {
        if (axios.isCancel(e)) {
          ElMessage.info("影片已取消上傳");
          task.isPause = true;
          task.isUploading = false;
          //startNextTask
        } else {
          console.log(e);
          await markUploadFailed(task.videoId);
          uploadingTasks.value = uploadingTasks.value.filter(
            (item) => item.videoId !== task.videoId
          );
          ElMessage.error("影片上傳失敗");
          await courseStore.fetchCourseOverview();
          throw new Error("uploading error");
        }
        break;
      }
    }
    // if(task.uploadedBytes>=task.fileSize){
    //   //success

    // }else{

    // }
    await startNextTask();
  };
  //   const markFailed = async () => {
  //   await markUploadFailed(videoAssetId);
  //   ElMessage.success("影片上傳失敗");
  // };
  // const markComplete = async () => {
  //   await markUploadComplete(videoAssetId);
  //   ElMessage.success("影片上傳成功");
  // };
  // const isUploading = (lessonId) => {
  //   return videoStore.uploadingVideoList.find((item) => item.lessonId === lessonId) ? true : false;
  // };
  const uploadVideoToGCP = async (task) => {
    task.sessionURI = await initializeUpload(task.initiateURL);
    console.log("initializeUpload");
    uploadingTasks.value.push(task);
    if (ableUpload.value) {
      // const await initializeUpload(task.initiateURL)
      console.log("uploadChunkLoop");
      await uploadChunkLoop(task);
    }
    // const sessionURI = await getSessionURI(initiateURL);
    // await uploadVideoChunks(sessionURI, file);
    // videoStore.remove(videoAssetId);
    // await courseStore.fetchCourseOverview();
  };
  const startNextTask = async () => {
    while (ableUpload.value) {
      const nextTask = uploadingTasks.value.find(
        (item) => item.isUploading === false && !item.isPause
      );
      if (nextTask) {
        await uploadVideoToGCP(nextTask);
      } else {
        break;
      }
    }
  };
  // const getSessionURI = async (initiateURL) => {
  //   const res = await axios.post(initiateURL, null, {
  //     headers: {
  //       "x-goog-resumable": "start",
  //     },
  //   });
  //   return res.headers.location;
  // };
  // const uploadVideoChunks = async (sessionURI, file) => {
  //   const CHUNK_SIZE = 5 * 1024 * 1024;
  //   const totalSize = file.size;
  //   let offset = 0;
  //   while (offset < totalSize) {
  //     const chunkEnd = Math.min(offset + CHUNK_SIZE, totalSize);
  //     const chunk = file.slice(offset, chunkEnd);
  //     const contentRange = `bytes ${offset}-${chunkEnd - 1}/${totalSize}`;
  //     const res = await axios.put(sessionURI, chunk, {
  //       headers: {
  //         // "Content-Length": chunk.size,
  //         "Content-Range": contentRange,
  //       },
  //       validateStatus: function (status) {
  //         // 接受 200, 201 (表示上傳完成) 和 308 (表示分塊成功)
  //         return (status >= 200 && status < 300) || status === 308;
  //       },
  //     });
  //     console.log(res);
  //     if (res.status === 308) {
  //       offset = chunkEnd;
  //       continue;
  //     }
  //     if (res.status === 200) {
  //       console.log("complete");
  //       await markComplete();
  //       break;
  //     }
  //     await markFailed();
  //     throw new Error("uploading error");
  //   }
  // };
  return {
    uploadingTasks,
    uploadVideoToGCP,
  };
});
