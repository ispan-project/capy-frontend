<script setup>
import { useRouter } from "vue-router";
import useIndex from "@/utils/useIndex";
// useRouter
const router = useRouter();

const tableData = [
  {
    courseId: 101,
    courseTitle: "Vue 3 從零到實戰",
    category: "程式開發 / 前端",
    applicant: "林柏安",
    submittedAt: "2025-11-20 10:15",
  },
  {
    courseId: 102,
    courseTitle: "資料科學入門：用 Python 做分析",
    category: "資料科學",
    applicant: "張語婕",
    submittedAt: "2025-11-21 09:40",
  },
  {
    courseId: 103,
    courseTitle: "UX 實務：設計流程與案例",
    category: "設計 / UX",
    applicant: "許庭榕",
    submittedAt: "2025-11-22 14:05",
  },
  {
    courseId: 104,
    courseTitle: "Node.js 後端 API 開發",
    category: "程式開發 / 後端",
    applicant: "王建宇",
    submittedAt: "2025-11-23 18:20",
  },
  {
    courseId: 105,
    courseTitle: "行銷企劃 101",
    category: "行銷",
    applicant: "陳姿穎",
    submittedAt: "2025-11-24 08:55",
  },
  {
    courseId: 106,
    courseTitle: "AI 影音剪輯工作坊",
    category: "攝影與影片",
    applicant: "黃子翔",
    submittedAt: "2025-11-24 16:30",
  },
];
const data = computed(() => useIndex(tableData));
const viewCourseDetail = (courseId) => {
  router.push({
    name: "viewCourseDetail",
    params: {
      courseId,
    },
    query: {
      viewtype: "apply",
    },
  });
};
</script>
<template>
  <h2 class="section-heading">上架申請列表</h2>
  <div class="wrapper">
    <el-table
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
      size="large"
      :data="data"
      style="width: 100%"
    >
      <el-table-column label="序號" width="80">
        <template #default="{ row }">
          <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="courseTitle" label="課程名稱">
        <template #default="{ row }">
          <div style="width: 80%; padding-left: 10%">
            <p>{{ row.courseTitle }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分類" />
      <el-table-column prop="applicant" label="申請人" />
      <el-table-column prop="submittedAt" label="申請時間" />

      <el-table-column label="檢視">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewCourseDetail(row.courseId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped>
.pagination-btn {
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
}
:deep(.tbody-cell .cell) {
  display: flex;
  justify-content: center;

  padding: 8px 0;
}
:deep(.table-row .cell) {
  padding: 12px 0;
}

:deep(.table-head .cell) {
  font-size: 18px;
  text-align: center;
  padding: 4px 0 28px 0;
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
