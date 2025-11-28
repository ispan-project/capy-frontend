<script setup>
import ChangeUserStatusDialog from "./ChangeUserStatusDialog.vue";

const tableData = ref([
  {
    role_list: ["admin", "teacher"],
    isActive: true,
    update_time: "2025-10-29",
    user_id: 1,
    username: "emily",
    email: "example@gmail.com",
    avatar_url: "https://picsum.photos/200",
  },
  {
    role_list: ["admin"],
    isActive: false,
    update_time: "2025-10-29",
    user_id: 2,
    username: "emily",
    email: "example@gmail.com",
    avatar_url: "https://picsum.photos/200",
  },
  {
    role_list: ["admin", "teacher"],
    isActive: false,
    update_time: "2025-10-29",
    user_id: 3,
    username: "emily",
    email: "example@gmail.com",
    avatar_url: "https://picsum.photos/200",
  },
  {
    role_list: ["admin"],
    isActive: false,
    update_time: "2025-10-29",
    user_id: 4,
    username: "emily",
    email: "example@gmail.com",
    avatar_url: "https://picsum.photos/200",
  },
]);
for (let i = 0; i < tableData.value.length; i++) {
  tableData.value[i].index = i + 1;
}
const dialogRef = ref(null);

const handleChangeStatus = (userdetail) => {
  return new Promise((resolve) => {
    dialogRef.value.open(userdetail, resolve);
  }).then(async (success) => {
    if (success) {
      //重新使用render函數
      console.log(1);
    }
    return success;
  });
};
</script>
<template>
  <ChangeUserStatusDialog ref="dialogRef" />
  <h2 class="section-heading">用戶狀態管理</h2>
  <div class="wrapper">
    <el-table
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
      size="large"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="序號" width="80">
        <template #default="{ row }">
          <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column width="350" label="用戶資訊">
        <template #default="{ row }">
          <div style="display: flex; gap: 48px">
            <div style="display: flex; align-items: center">
              <el-avatar :size="50" :src="row.avatar_url" />
            </div>

            <div>
              <h3 style="margin-bottom: 12px; font-weight: 500">{{ row.username }}</h3>
              <p>{{ row.email }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身分">
        <template #default="{ row }">
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center">
            <el-tag type="info" effect="plain" size="large" round v-for="role in row.role_list">{{
              role
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="狀態">
        <template #default="{ row }">
          <div style="width: fit-content">
            <el-switch
              :before-change="() => handleChangeStatus(row)"
              size="large"
              v-model="row.isActive"
            />
            <p style="text-align: center">{{ row.isActive ? "活動中" : "禁用" }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最後更新時間">
        <template #default="{ row }">
          <span style="font-style: italic; font-weight: 500">{{ row.update_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped>
:deep(.tbody-cell .cell) {
  display: flex;
  justify-content: center;
}

:deep(.table-head .cell) {
  font-size: 18px;
  text-align: center;
  padding: 4px 0 28px 0;
}
.el-tag {
  border: 2px solid #f0f2f5;
}
.index {
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: #909399;
  opacity: 0.3;
  transition: opacity 0.2s;
}
.table-row:hover .index {
  opacity: 1;
}
</style>
