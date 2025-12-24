import { defineStore } from "pinia";
import { markUploadComplete, markUploadFailed } from "@/api/teacher/video";
import { useCourseStore } from "@/stores/course";
import axios from "axios";

export const useVideoStore = defineStore("videoStore", () => {
  const courseStore = useCourseStore();

  const uploadingVideoList = ref([]);
  const append = (id) => {
    uploadingVideoList.value.push(id);
  };
  const remove = (videoAssetId) => {
    uploadingVideoList.value = uploadingVideoList.value.filter(
      (vid) => vid.videoAssetId !== videoAssetId
    );
  };

  // upload queue
  const uploadingTasks = ref([]);
  const notifyTaskChange = () => {
    uploadingTasks.value = [...uploadingTasks.value];
  };

  const MAX_UPLOADING_COUNT = ref(3);
  const CHUNK_SIZE = 1024 * 1024 * 5;
  const currentUploadingCount = computed(
    () => uploadingTasks.value.filter((task) => task.isUploading).length
  );
  const ableUpload = computed(() => currentUploadingCount.value < MAX_UPLOADING_COUNT.value);

  // get signed upload session
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

  // resume upload: query already uploaded bytes
  const getGcsUploadBytes = async (sessionUri) => {
    try {
      const res = await axios.put(sessionUri, null, {
        headers: {
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

  // chunk upload loop with progress reporting
  const uploadChunkLoop = async (task) => {
    task.isUploading = true;
    task.abortController = new AbortController();
    notifyTaskChange();

    const totalSize = task.fileSize;
    let startByte = task.uploadedBytes;
    if (startByte > 0) {
      const gcsBytes = await getGcsUploadBytes(task.sessionURI);
      if (gcsBytes === -1) {
        startByte = 0;
        throw new Error("sessionUri missing");
      } else if (gcsBytes > startByte) {
        startByte = gcsBytes;
      }
    }
    task.uploadedBytes = startByte;

    while (task.uploadedBytes < totalSize) {
      if (!task.isUploading || task.abortController.signal.aborted) {
        break;
      }
      const start = task.uploadedBytes;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunk = task.file.slice(start, end);
      const contentRange = `bytes ${start}-${end - 1}/${totalSize}`;
      try {
        const res = await axios.put(task.sessionURI, chunk, {
          signal: task.abortController.signal,
          headers: {
            "Content-Range": contentRange,
          },
          validateStatus: (status) => status === 200 || status === 201 || status === 308,
          onUploadProgress: (progressEvent) => {
            const overallProgressBytes = start + progressEvent.loaded;
            const progress = (overallProgressBytes / totalSize) * 100;
            task.progressPersent = progress.toFixed(1);
            notifyTaskChange();
          },
        });

        if (res.status === 308) {
          const rangeHeader = res.headers.range;
          if (rangeHeader) {
            const newEndByte = parseInt(rangeHeader.split("-")[1]);
            task.uploadedBytes = newEndByte + 1;
          } else {
            task.uploadedBytes = end;
          }
          task.progressPersent = ((task.uploadedBytes / totalSize) * 100).toFixed(1);
          notifyTaskChange();
        } else if (res.status === 200 || res.status === 201) {
          task.uploadedBytes = totalSize;
          task.progressPersent = 100;
          await markUploadComplete(task.videoId);
          uploadingTasks.value = uploadingTasks.value.filter(
            (item) => item.videoId !== task.videoId
          );
          notifyTaskChange();
          ElMessage.success("影片上傳完成");
          await courseStore.fetchCourseOverview();
          task.isUploading = false;
          notifyTaskChange();
          break;
        }
      } catch (e) {
        if (axios.isCancel(e)) {
          ElMessage.info("影片已暫停上傳");
          task.isPause = true;
          task.isUploading = false;
          notifyTaskChange();
        } else {
          console.log(e);
          await markUploadFailed(task.videoId);
          uploadingTasks.value = uploadingTasks.value.filter(
            (item) => item.videoId !== task.videoId
          );
          notifyTaskChange();
          ElMessage.error("影片上傳失敗");
          await courseStore.fetchCourseOverview();
          throw new Error("uploading error");
        }
        break;
      }
    }
    await startNextTask();
  };

  const uploadVideoToGCP = async (task) => {
    task.sessionURI = await initializeUpload(task.initiateURL);
    const exists = uploadingTasks.value.find((item) => item.lessonId === task.lessonId);
    if (!exists) {
      uploadingTasks.value.push(task);
      notifyTaskChange();
    }
    console.log(ableUpload.value, "898989");
    if (ableUpload.value) {
      await uploadChunkLoop(task);
    }
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
  const resumableUpload = async (lessonId) => {
    const target = uploadingTasks.value.find((item) => item.lessonId === lessonId);
    console.log(target);
    if (target) {
      target.isPause = false;
      if (ableUpload.value) {
        await uploadChunkLoop(target);
        notifyTaskChange();
      }
    } else {
      ElMessage.error("未找到影片");
    }
  };
  const pauseUploading = (lessonId) => {
    const target = uploadingTasks.value.find((item) => item.lessonId === lessonId);
    console.log(lessonId);
    if (target) {
      target.isPause = true;
      target.isUploading = false;
      target.abortController.abort();
      notifyTaskChange();
      console.log(3);
    }
  };
  const cancelUploading = async (lessonId) => {
    const target = uploadingTasks.value.find((item) => item.lessonId === lessonId);
    if (target) {
      await markUploadFailed(target.videoId);
      uploadingTasks.value = uploadingTasks.value.filter((item) => item.lessonId !== lessonId);
      target.isUploading = false;
      target.abortController.abort();
    } else {
      ElMessage.error("單元影片不存在");
    }
  };
  return {
    uploadingTasks,
    uploadVideoToGCP,
    resumableUpload,
    pauseUploading,
    cancelUploading,
  };
});
