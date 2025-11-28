<script setup>
const createDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const currentTagValue = ref(null);
const newTagValue = ref("");
const taglist = ref([
  {
    tag_id: "1",
    tag_name: "限時優惠",
  },
  {
    tag_id: "2",
    tag_name: "全站第一",
  },
]);
const handelDelete = (tag) => {
  currentTagValue.value = tag;
  deleteDialogVisible.value = true;
};
const handleCreateTag = () => {
  //發送新增請求
  createDialogVisible.value = false;
  //獲取最新資訊
};
const handleDeleteTag = () => {
  //發送刪除請求
  deleteDialogVisible.value = false;
  //重新獲取最新標籤資訊
};
watch(createDialogVisible, (val) => {
  if (!val) newTagValue.value = "";
});
</script>
<template>
  <div class="wrapper">
    <el-dialog v-model="createDialogVisible" width="500">
      <template #header>
        <h4 class="dialog-heading">新增課程標籤</h4>
      </template>
      <div class="dialog-body">
        <div style="text-align: center">
          <el-input
            size="large"
            v-model="newTagValue"
            placeholder="輸入標籤名稱"
            style="width: 90%"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="info" @click="createDialogVisible = false">取消</el-button>
          <el-button size="large" type="primary" @click="handleCreateTag"> 確認 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="deleteDialogVisible" width="500">
      <template #header>
        <h4 class="dialog-heading">刪除課程標籤</h4>
      </template>
      <div class="dialog-body">
        <p>
          確認刪除標籤<span style="font-weight: 500; color: #409eff">{{
            currentTagValue?.tag_name
          }}</span
          >?
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="info" @click="deleteDialogVisible = false">取消</el-button>
          <el-button size="large" type="primary" @click="handleDeleteTag"> 確認 </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="title">
      <h3 class="section-title" style="margin-bottom: 0">課程標籤管理</h3>
      <el-button @click="createDialogVisible = true" round type="primary" class="add-btn"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon>新增標籤</el-button
      >
    </div>
    <p style="padding-bottom: 12px">現有標籤 :</p>
    <div class="pool">
      <span @click="handelDelete(tag)" v-for="tag in taglist" :key="tag.tag_id" class="pool-item"
        >{{ tag.tag_name }}<el-icon><CircleClose /></el-icon
      ></span>
    </div>
  </div>
</template>
<style scoped>
.title {
  padding: 8px 0;
  padding-right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.add-btn {
  padding: 18px 24px;
}
.pool {
  border-radius: 16px;
  padding: 24px 12px;
  background-color: #f0f3f5;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #000;
  background-color: #000;
  color: #fff;
  border-radius: 80px;
  font-weight: 500;
}
.pool-item:hover {
  color: #000;
  background-color: #f0f3f5;
  cursor: pointer;
}
.dialog-footer {
  display: flex;
  gap: 24px;
  justify-content: center;
  padding-bottom: 12px;
}
.dialog-body {
  padding: 24px;
  font-size: 18px;
  text-align: center;
}
.username {
  font-weight: 500;
  color: #409eff;
}
.dialog-heading {
  text-align: center;
  padding: 12px 0;
  font-weight: 500;
  font-size: 24px;
}
</style>
