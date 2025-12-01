<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import useIndex from "@/utils/useIndex";

const router = useRouter();

const tableData = [
  {
    courseId: 201,
    courseTitle: "全端實戰：從 REST 到部署",
    instructor: "林柏安",
    category: "程式開發 / 全端",
    status: "published",
    publishedAt: "2025-11-10 09:30",
  },
  {
    courseId: 202,
    courseTitle: "演算法刷題班",
    instructor: "王建宇",
    category: "程式開發 / 後端",
    status: "pending_review",
    publishedAt: "—",
  },
  {
    courseId: 203,
    courseTitle: "UX 實戰：案例與流程",
    instructor: "許庭榕",
    category: "設計 / UX",
    status: "submitted_rejected",
    publishedAt: "—",
  },
  {
    courseId: 204,
    courseTitle: "AI 影片剪輯工作坊",
    instructor: "黃子翔",
    category: "攝影與影片",
    status: "transcoding",
    publishedAt: "—",
  },
  {
    courseId: 205,
    courseTitle: "資料科學入門：用 Python 做分析",
    instructor: "張語婕",
    category: "資料科學",
    status: "transcoding_failed",
    publishedAt: "—",
  },
  {
    courseId: 206,
    courseTitle: "行銷企劃 101",
    instructor: "陳姿穎",
    category: "行銷",
    status: "force_unpublish",
    publishedAt: "2025-11-05 15:20",
  },
];

const statusLabel = (status) => {
  switch (status) {
    case "published":
      return "已上架";
    case "pending_review":
      return "待審核";
    case "submitted_rejected":
      return "審核退件";
    case "transcoding":
      return "轉檔中";
    case "transcoding_failed":
      return "轉檔失敗";
    case "force_unpublish":
      return "強制下架";
    default:
      return "未知";
  }
};

const statusTagType = (status) => {
  switch (status) {
    case "published":
      return "success";
    case "pending_review":
    case "transcoding":
      return "warning";
    case "submitted_rejected":
    case "transcoding_failed":
    case "force_unpublish":
      return "danger";
    default:
      return "info";
  }
};

const data = computed(() =>
  useIndex(tableData).map((item) => ({
    ...item,
    statusText: statusLabel(item.status),
    statusType: statusTagType(item.status),
  }))
);

const viewCourseDetail = (courseId) => {
  router.push({
    name: "viewCourseDetail",
    params: { courseId },
  });
};
</script>
<template>
  <h2 class="section-heading">課程狀態管理</h2>

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
      <el-table-column label="課程名稱">
        <template #default="{ row }">
          <div style="width: 80%; padding-left: 10%">
            <p>{{ row.courseTitle }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="instructor" label="講師" />
      <el-table-column prop="category" label="分類" />
      <el-table-column label="狀態">
        <template #default="{ row }">
          <el-tag :type="row.statusType" effect="plain">{{ row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上架日期">
        <template #default="{ row }">
          <span class="published-at">{{ row.publishedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewCourseDetail(row.courseId)"
            >查看詳情</el-button
          >
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

.published-at {
  font-style: italic;
  font-weight: 500;
}
</style>
