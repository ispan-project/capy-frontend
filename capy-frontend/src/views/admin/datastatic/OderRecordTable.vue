<script setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
import useIndex from "@/utils/useIndex";

const orders = ref([
  { id: "ORD-202511-0001", createdAt: "2025-11-24T10:12:00", status: "paid", amount: 3200 },
  { id: "ORD-202511-0002", createdAt: "2025-11-23T19:05:00", status: "pending", amount: 1880 },
  { id: "ORD-202511-0003", createdAt: "2025-11-21T08:45:00", status: "failed", amount: 4200 },
  { id: "ORD-202510-0021", createdAt: "2025-10-15T14:33:00", status: "paid", amount: 5600 },
  { id: "ORD-202509-0131", createdAt: "2025-09-02T11:11:00", status: "paid", amount: 780 },
]);

const statusOptions = [
  { label: "全部狀態", value: "all" },
  { label: "已付款", value: "paid" },
  { label: "待付款", value: "pending" },
  { label: "付款失敗", value: "failed" },
];

const filters = ref({ status: "all", dateRange: [] });
const dialogVisible = ref(false);
const selectedOrder = ref(null);

const filteredOrders = computed(() => {
  const [start, end] = filters.value.dateRange || [];
  return orders.value.filter((order) => {
    const statusMatched = filters.value.status === "all" || order.status === filters.value.status;
    let dateMatched = true;
    if (start && end) {
      const orderTs = dayjs(order.createdAt).valueOf();
      const startTs = dayjs(start).startOf("day").valueOf();
      const endTs = dayjs(end).endOf("day").valueOf();
      dateMatched = orderTs >= startTs && orderTs <= endTs;
    }
    return statusMatched && dateMatched;
  });
});

const displayOrders = computed(() => useIndex(filteredOrders.value));

const statusTag = (status) => {
  if (status === "paid") return { text: "已付款", type: "success" };
  if (status === "pending") return { text: "待付款", type: "warning" };
  if (status === "failed") return { text: "付款失敗", type: "danger" };
  return { text: status, type: "info" };
};

const resetFilters = () => {
  filters.value = { status: "all", dateRange: [] };
};

const openOrder = (row) => {
  selectedOrder.value = row;
  dialogVisible.value = true;
};

const formatTime = (iso) => dayjs(iso).format("YYYY-MM-DD HH:mm");
</script>

<template>
  <div>
    <div class="wrapper" style="margin-bottom: 24px">
      <div class="section-title">訂單紀錄</div>
      <div class="filter-bar">
        <el-form inline label-position="left" size="large" class="filter-form">
          <el-form-item label="時間區段">
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
          <el-form-item label="訂單狀態">
            <el-select v-model="filters.status" placeholder="選擇訂單狀態" style="width: 200px">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="resetFilters">清除篩選</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="wrapper">
      <el-table
        stripe
        :data="displayOrders"
        size="large"
        :row-class-name="() => 'table-row'"
        :cell-class-name="() => 'tbody-cell'"
        :header-cell-class-name="() => 'table-head'"
        empty-text="暫無訂單"
        @row-click="openOrder"
      >
        <el-table-column label="序號" width="80">
          <template #default="{ row }">
            <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="訂單編號" />
        <el-table-column label="成立時間" width="200">
          <template #default="{ row }">
            <span class="time-text">{{ formatTime(row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="訂單狀態">
          <template #default="{ row }">
            <el-tag size="large" round effect="plain" :type="statusTag(row.status).type">
              {{ statusTag(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="總金額" align="right">
          <template #default="{ row }">
            <span class="amount">$ {{ row.amount.toLocaleString() }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-btn">
        <el-pagination
          size="large"
          background
          layout="prev, pager, next"
          :page-size="8"
          :total="displayOrders.length"
        />
      </div>
    </div>

    <el-dialog width="500" v-model="dialogVisible" title="訂單詳情" align-center>
      <div v-if="selectedOrder" class="detail-list">
        <div class="detail-row">
          <span class="detail-label">訂單編號</span>
          <span class="detail-value">{{ selectedOrder.id }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">成立時間</span>
          <span class="detail-value">{{ formatTime(selectedOrder.createdAt) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">訂單狀態</span>
          <el-tag round size="large" effect="plain" :type="statusTag(selectedOrder.status).type">
            {{ statusTag(selectedOrder.status).text }}
          </el-tag>
        </div>
        <div class="detail-row">
          <span class="detail-label">總金額</span>
          <span class="detail-value">$ {{ selectedOrder.amount.toLocaleString() }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.time-text {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.amount {
  font-weight: 600;
}

/* .tbody-cell { */
/* marker class holder for deep selector */
/* } */

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

:deep(.table-row:hover) {
  cursor: pointer;
}

:deep(.el-dialog__header) {
  text-align: center;
  padding: 12px 0;
  margin-right: 0;
  padding-bottom: 0;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.5px;
}

:deep(.el-dialog__body) {
  padding: 28px 28px 24px;
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
  font-size: 16px;
  min-width: 120px;
}

.detail-value {
  /* flex: 1; */
  font-size: 16px;
  word-break: break-word;
  /* text-align: right; */
}
</style>
