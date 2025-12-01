<script setup>
import { computed, ref } from "vue";
import useIndex from "@/utils/useIndex";

const typeOptions = [
  { label: "所有類型", value: "all" },
  { label: "講師審核", value: "instructor_review" },
  { label: "課程審核", value: "course_review" },
  { label: "強制下架", value: "force_unpublish" },
  { label: "公告發布", value: "announcement" },
  { label: "撥款處理", value: "payout" },
];

const typeMeta = {
  instructor_review: { label: "講師審核", tagType: "warning" },
  course_review: { label: "課程審核", tagType: "success" },
  force_unpublish: { label: "強制下架", tagType: "danger" },
  announcement: { label: "公告發布", tagType: "info" },
  payout: { label: "撥款處理", tagType: "primary" },
};

const records = ref([
  {
    id: 1,
    admin: "Alice Chen",
    type: "course_review",
    target: "課程 #321",
    summary: "審核通過「Vue 3 入門實戰」",
    reason: "內容完整，無需補件",
    createdAt: "2025-11-26T14:10:00",
  },
  {
    id: 2,
    admin: "David Lin",
    type: "instructor_review",
    target: "講師申請 #9821",
    summary: "講師審核退回",
    reason: "缺少作品集連結，請補件後再提交",
    createdAt: "2025-11-24T10:32:00",
  },
  {
    id: 3,
    admin: "Joyce Wu",
    type: "force_unpublish",
    target: "課程 #198",
    summary: "強制下架「AI 投資實戰」",
    reason: "收錄未授權素材，已通知講師修正",
    createdAt: "2025-11-22T19:40:00",
  },
  {
    id: 4,
    admin: "Brian Yang",
    type: "announcement",
    target: "全站公告",
    summary: "發布黑色星期五促銷公告",
    reason: "同步行銷活動，限定 72 小時",
    createdAt: "2025-11-21T08:05:00",
  },
  {
    id: 5,
    admin: "Stella Kao",
    type: "payout",
    target: "講師 #77",
    summary: "完成 11 月講師撥款",
    reason: "金額 87,500，已寄出對帳通知",
    createdAt: "2025-11-20T16:15:00",
  },
]);

const filters = ref({
  type: "all",
  dateRange: [],
});

const dialogVisible = ref(false);
const selectedRecord = ref(null);

const resetFilters = () => {
  filters.value = { type: "all", dateRange: [] };
};

const filteredRecords = computed(() => {
  const [start, end] = filters.value.dateRange || [];
  return records.value.filter((record) => {
    const typeMatched = filters.value.type === "all" || record.type === filters.value.type;
    let dateMatched = true;
    if (start && end) {
      const recordTs = new Date(record.createdAt).getTime();
      const startTs = new Date(start).getTime();
      const endTs = new Date(end).getTime() + 24 * 60 * 60 * 1000 - 1;
      dateMatched = recordTs >= startTs && recordTs <= endTs;
    }
    return typeMatched && dateMatched;
  });
});

const displayRecords = computed(() => useIndex(filteredRecords.value));

const readableTime = (isoString) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const typeLabel = (value) => typeMeta[value]?.label || "其他";

const openRecord = (row) => {
  selectedRecord.value = row;
  dialogVisible.value = true;
};
</script>

<template>
  <div>
    <h2 class="section-heading">操作紀錄查詢</h2>
    <div class="wrapper" style="margin-bottom: 32px">
      <div class="filter-bar">
        <el-form inline size="large" label-position="left" class="filter-form">
          <el-form-item label="操作類型 :">
            <el-select
              v-model="filters.type"
              placeholder="選擇操作類型"
              clearable
              style="width: 220px"
            >
              <el-option
                v-for="option in typeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作時間 :">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              style="width: 320px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="resetFilters">
              <!-- <el-icon><RefreshRight /></el-icon> -->
              清除篩選
            </el-button>
          </el-form-item>
        </el-form>
        <div class="meta">
          <span class="meta-label">共</span>
          <span class="meta-value">{{ filteredRecords.length }}</span>
          <span class="meta-label">筆結果</span>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <el-table
        stripe
        :row-class-name="() => 'table-row'"
        :cell-class-name="() => 'tbody-cell'"
        :header-cell-class-name="() => 'table-head'"
        :data="displayRecords"
        size="large"
        empty-text="暫無符合的操作紀錄"
        @row-click="openRecord"
      >
        <el-table-column label="序號" width="80">
          <template #default="{ row }">
            <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作類型">
          <template #default="{ row }">
            <el-tag size="large" round effect="plain" :type="typeMeta[row.type]?.tagType || 'info'">
              {{ typeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作摘要">
          <template #default="{ row }">
            <div style="width: 80%; padding-left: 10%">
              <p class="summary-title">{{ row.summary }}</p>
              <p class="summary-reason">{{ row.reason }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="管理員">
          <template #default="{ row }">
            <span>{{ row.admin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="時間">
          <template #default="{ row }">
            <span class="time-text">{{ readableTime(row.createdAt) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-btn">
        <el-pagination
          size="large"
          background
          layout="prev, pager, next"
          :page-size="8"
          :total="filteredRecords.length"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="操作詳情" width="520px" align-center>
      <div class="detail-list" v-if="selectedRecord">
        <div class="detail-row">
          <span class="detail-label">操作類型</span>
          <el-tag round effect="plain" :type="typeMeta[selectedRecord.type]?.tagType || 'info'">
            {{ typeLabel(selectedRecord.type) }}
          </el-tag>
        </div>
        <div class="detail-row">
          <span class="detail-label">摘要</span>
          <span class="detail-value">{{ selectedRecord.summary }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">原因 / 備註</span>
          <span class="detail-value">{{ selectedRecord.reason }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">管理員</span>
          <span class="detail-value">{{ selectedRecord.admin }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">時間</span>
          <span class="detail-value">{{ readableTime(selectedRecord.createdAt) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;

  gap: 20px;
  flex-wrap: wrap;
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.el-form-item {
  margin: 0;
}
.meta {
  /* text-align: right; */
  color: #909399;
  min-width: 120px;
}

.meta-value {
  /* display: block; */
  margin: 0 4px;
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.meta-label {
  font-size: 14px;
}

.summary-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.summary-reason {
  color: #909399;
  font-size: 14px;
  line-height: 1.4;
}

.target-text {
  font-weight: 500;
}

.time-text {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
}
:deep(.el-dialog__header) {
  text-align: center;
  font-weight: 500;
  margin-right: 0;
  margin-bottom: 12px;
  padding-right: 0;
  padding-top: 12px;
  padding-bottom: 12px;
}
:deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
:deep(.el-dialog__body) {
  padding: 12px;
}
:deep(.table-row:hover) {
  cursor: pointer;
}
:deep(.table-row .cell) {
  padding: 8px 0;
}
:deep(.tbody-cell .cell) {
  display: flex;
  justify-content: center;
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
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;

  line-height: 1.2;
}

.detail-label {
  color: #909399;
  font-weight: 500;
  min-width: 120px;
}

.detail-value {
  flex: 1;

  word-break: break-word;
}
</style>
