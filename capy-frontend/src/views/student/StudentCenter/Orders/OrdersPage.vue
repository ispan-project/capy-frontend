<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Purchased history</h1>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <el-dropdown @command="handleSortChange" trigger="click">
        <el-button class="filter-btn">
          Sort by: {{ sortLabels[currentSort] }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="date" :class="{ active: currentSort === 'date' }">
              Date
            </el-dropdown-item>
            <el-dropdown-item command="price" :class="{ active: currentSort === 'price' }">
              Price
            </el-dropdown-item>
            <el-dropdown-item command="title" :class="{ active: currentSort === 'title' }">
              Title
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown @command="handleStatusFilter" trigger="click">
        <el-button class="filter-btn">
          Filter by: {{ statusLabels[currentStatus] }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="all" :class="{ active: currentStatus === 'all' }">
              All Status
            </el-dropdown-item>
            <el-dropdown-item command="paid" :class="{ active: currentStatus === 'paid' }">
              Paid
            </el-dropdown-item>
            <el-dropdown-item command="pending" :class="{ active: currentStatus === 'pending' }">
              Pending
            </el-dropdown-item>
            <el-dropdown-item command="failed" :class="{ active: currentStatus === 'failed' }">
              Failed
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="filteredOrders.length === 0"
      description="No orders found"
      :image-size="150"
    >
      <el-button type="primary" @click="goToExplore">
        Start Shopping
      </el-button>
    </el-empty>

    <!-- Orders List -->
    <div v-else class="orders-list">
      <div
        v-for="order in paginatedOrders"
        :key="order.id"
        class="order-card"
      >
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">Order ID: #{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.orderDate) }}</span>
          </div>
          <el-tag
            :type="getStatusType(order.status)"
            class="order-status"
          >
            {{ order.status.toUpperCase() }}
          </el-tag>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <div
            v-for="item in order.items"
            :key="item.courseId"
            class="order-item"
            @click="goToCourse(item.courseId)"
          >
            <img
              :src="item.cover"
              :alt="item.title"
              class="course-cover"
            />
            <div class="course-details">
              <h3 class="course-title">{{ item.title }}</h3>
              <p class="course-instructor">Instructor: {{ item.instructor }}</p>
            </div>
            <div class="course-price">
              NT$ {{ item.price.toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Order Footer -->
        <div class="order-footer">
          <div class="order-total">
            <span class="total-label">Total Amount:</span>
            <span class="total-amount">NT$ {{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <el-button
              v-if="order.transactionId"
              size="small"
              @click="viewReceipt(order)"
            >
              View Receipt
            </el-button>
            <el-button
              v-if="order.status === 'pending'"
              type="primary"
              size="small"
              @click="proceedPayment(order)"
            >
              Complete Payment
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredOrders.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { orders } from '@/mockData'

const router = useRouter()

// State
const currentSort = ref('date')
const currentStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(5)

const sortLabels = {
  date: 'Date',
  price: 'Price',
  title: 'Title'
}

const statusLabels = {
  all: 'All Status',
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed'
}

// 使用統一的訂單資料
const allOrders = ref(orders)

// Computed
const filteredOrders = computed(() => {
  let orders = [...allOrders.value]
  
  // Filter by status
  if (currentStatus.value !== 'all') {
    orders = orders.filter(order => order.status === currentStatus.value)
  }
  
  // Sort
  orders.sort((a, b) => {
    switch (currentSort.value) {
      case 'date':
        return new Date(b.orderDate) - new Date(a.orderDate)
      case 'price':
        return b.totalAmount - a.totalAmount
      case 'title':
        return a.items[0].title.localeCompare(b.items[0].title)
      default:
        return 0
    }
  })
  
  return orders
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// Methods
const handleSortChange = (command) => {
  currentSort.value = command
  currentPage.value = 1
}

const handleStatusFilter = (command) => {
  currentStatus.value = command
  currentPage.value = 1
}

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusType = (status) => {
  const types = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const goToCourse = (courseId) => {
  router.push(`/course/${courseId}`)
}

const goToExplore = () => {
  router.push('/explore')
}

const viewReceipt = (order) => {
  console.log('View receipt for order:', order.id)
  // 實際應該打開收據頁面或下載 PDF
}

const proceedPayment = (order) => {
  console.log('Proceed payment for order:', order.id)
  // 實際應該導向付款頁面
}
</script>

<style scoped>
.orders-page {
  padding: 0;
}

/* Header */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Filters */
.filters-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #333;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

:deep(.el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item.active) {
  color: #4CAF50;
  font-weight: 600;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f5f5f5;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.order-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.order-date {
  font-size: 12px;
  color: #666;
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
}

/* Order Items */
.order-items {
  padding: 16px 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.order-item:hover {
  background: #f8f9fa;
}

.order-item + .order-item {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.course-cover {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.course-details {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-instructor {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.course-price {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  flex-shrink: 0;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.order-actions {
  display: flex;
  gap: 8px;
}

:deep(.el-button--small) {
  padding: 8px 16px;
  font-size: 13px;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

:deep(.el-pagination) {
  gap: 8px;
}

:deep(.el-pagination button),
:deep(.el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-pager li.is-active) {
  background: #1a1a1a;
  color: white;
}

:deep(.el-pager li:hover) {
  color: #4CAF50;
}

/* Empty State */
:deep(.el-empty) {
  padding: 60px 0;
}

:deep(.el-button--primary) {
  background: #4CAF50;
  border-color: #4CAF50;
}

:deep(.el-button--primary:hover) {
  background: #45a049;
  border-color: #45a049;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 22px;
  }

  .filters-section {
    flex-direction: column;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-cover {
    width: 100%;
    height: 160px;
  }

  .course-price {
    align-self: flex-end;
  }

  .order-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .order-total {
    justify-content: space-between;
  }

  .order-actions {
    width: 100%;
  }

  .order-actions .el-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .course-title {
    font-size: 14px;
  }

  .course-instructor {
    font-size: 12px;
  }
}
</style>