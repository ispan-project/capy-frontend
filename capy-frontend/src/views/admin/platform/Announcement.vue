<script setup>
const dialogVisible = ref(false);
const current_announcement_type = ref("all");
const addDialogVisible = ref(false);
const currentAnnouncement = ref(null);
const checkoutDetail = (item) => {
  currentAnnouncement.value = item;
  dialogVisible.value = true;
};
const announcementlist = ref([
  {
    id: 1,
    title: "新年優惠 課程全面85折",
    detail: "老師缺錢了 大家來買課",
    time: "2025-11-18",
    announcement_type: "platform",
    posted_by: "emily",
    target_audience: "all",
  },
  {
    id: 2,
    title: "新年優惠 課程全面75折",
    detail: "老師缺錢了 大家快來買",
    time: "2025-11-18",
    announcement_type: "instructor",
    posted_by: "david",
    target_audience: "instructor",
  },
  {
    id: 3,
    title: "新年優惠 課程全面75折",
    detail: "老師缺錢了 大家快來買",
    time: "2025-11-18",
    announcement_type: "instructor",
    posted_by: "david",
    target_audience: "instructor",
  },
]);
const formModel = ref({
  title: "",
  content: "",
  target_audience: "",
});
watch(addDialogVisible, (val) => {
  if (!val)
    formModel.value = {
      title: "",
      content: "",
      target_audience: "",
    };
});
</script>
<template>
  <div>
    <!-- //公告詳情 -->
    <el-dialog v-model="dialogVisible" center title="公告詳情" width="500">
      <template #header>
        <h4 class="dialog-heading">公告詳情</h4>
      </template>
      <div class="dialog-body">
        <p>
          {{ currentAnnouncement?.detail }}
        </p>
        <p><span class="detail-label">發布人:</span>{{ currentAnnouncement?.posted_by }}</p>
        <p>
          <span class="detail-label">發布時間:</span>
          <span style="font-style: italic; font-size: 16px">{{ currentAnnouncement?.time }}</span>
        </p>
        <p><span class="detail-label">可見對象:</span>{{ currentAnnouncement?.target_audience }}</p>
      </div>
    </el-dialog>
    <!-- //發布公告 -->
    <el-dialog
      v-model="addDialogVisible"
      style="padding-top: 24px"
      center
      title="發布公告"
      width="500"
    >
      <el-form
        style="padding: 12px"
        label-position="top"
        size="large"
        ref="formRef"
        :model="formModel"
      >
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">標題 :</span>
          </template>
          <el-input v-model="formModel.title" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">內容 :</span>
          </template>
          <el-input v-model="formModel.content" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">公告對象 :</span>
          </template>
          <el-select
            v-model="formModel.target_audience"
            placeholder="選擇可見對象"
            style="width: 240px"
          >
            <el-option label="全站用戶" value="platform" />
            <el-option label="平台講師" value="teacher" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div
            style="display: flex; justify-content: center; gap: 12px; width: 100%; margin-top: 12px"
          >
            <el-button size="large" @click="addDialogVisible = false">取消</el-button>
            <el-button size="large" type="primary">發布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <h2 class="section-heading">全站公告管理</h2>
    <div
      style="
        display: flex;
        padding: 0 8px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 48px;
      "
    >
      <div style="display: flex; align-items: center; gap: 12px">
        <span style="font-weight: 500; font-size: 18px">發布人 :</span>
        <el-radio-group v-model="current_announcement_type" size="large" fill="#6cf">
          <el-radio-button label="All" value="all" />
          <el-radio-button label="平台" value="platform" />
          <el-radio-button label="教師" value="teacher" />
        </el-radio-group>
      </div>
      <el-button @click="addDialogVisible = true" type="primary" round size="large"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon>發布公告</el-button
      >
    </div>
    <ul class="message-list">
      <li v-for="item in announcementlist" @click="checkoutDetail(item)" class="message-list-item">
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 24px; gap: 4px">
            <h3 class="message-title">{{ item.title }}</h3>
            <el-tag
              v-show="current_announcement_type === 'platform'"
              class="tag"
              type="info"
              effect="plain"
              round
              size="large"
              >{{ item.target_audience === "all" ? "全站公告" : "僅講師可見" }}</el-tag
            >
          </div>
          <p style="margin-bottom: 12px; font-weight: 500">
            {{ item.announcement_type === "platform" ? "管理員" : "講師" }}{{ item.posted_by }}
          </p>
          <span style="font-style: italic; font-size: 14px">{{ item.time }}</span>
        </div>
        <span class="checkout">點擊查看詳情</span>
      </li>
    </ul>
    <div style="justify-content: center" class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped>
.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}
.message-list-item {
  padding: 10px 20px;
  position: relative;
  display: flex;
  gap: 20px;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  background-color: #fcfcfd;
  border-left: 5px solid rgb(216, 230, 237);
  /* transition:; */
}
.dialog-body {
  padding: 24px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* text-align: center; */
}
.detail-label {
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
}
.dialog-heading {
  text-align: center;
  padding: 12px 0;
  font-weight: 500;
  font-size: 24px;
}
.message-list-item:hover {
  transform: translateY(-2px);
  cursor: pointer;
}
.checkout {
  font-size: 14px;
  color: rgb(153, 173, 183);
}
.message-title {
  font-size: 20px;
  font-weight: 500;
}
.end-text {
  margin-top: 12px;
  text-align: center;
  color: rgb(153, 173, 183);
}
.add-btn {
  padding: 18px 24px;
}
</style>
