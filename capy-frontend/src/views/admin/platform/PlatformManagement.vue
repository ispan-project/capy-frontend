<script setup>
import TagManagement from "./TagManagement.vue";
</script>
<template>
  <h2 class="section-heading">分類管理</h2>
  <div style="display: flex; flex-direction: column; gap: 48px">
    <div class="wrapper">
      <div class="title">
        <h3 class="section-title" style="margin-bottom: 0">課程分類管理</h3>
        <el-button round type="primary" class="add-btn">添加分類</el-button>
      </div>
      <p style="padding-bottom: 12px">現有分類 :</p>
      <div class="pool">
        <span class="pool-item">555</span>
        <span class="pool-item">555</span>
        <span class="pool-item">555</span>
      </div>
    </div>
    <tag-management />
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
  padding: 16px 24px;
}
.pool {
  border-radius: 8px;
  padding: 24px 12px;
  background-color: #f0f3f5;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pool-item {
  padding: 8px 16px;
  border: 2px solid #000;
  border-radius: 80px;
  font-weight: 500;
}
.pool-item:hover {
  color: #fff;
  background-color: #000;
  cursor: pointer;
}
</style>
