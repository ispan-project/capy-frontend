<template>
  <div class="status-card-container">
    <el-result
      :title="resultTitle"
      :sub-title="resultDescription"
      class="status-result"
    >
      <template #icon>
        <el-icon :size="80" :color="iconColor">
          <component :is="iconComponent" />
        </el-icon>
      </template>

      <template #extra>
        <div class="action-buttons">
          <!-- PENDING 狀態 -->
          <el-button
            v-if="status === 'pending'"
            size="large"
            @click="goToHome"
          >
            返回首頁
          </el-button>

          <!-- APPROVED 狀態 -->
          <el-button
            v-if="status === 'approved'"
            type="primary"
            size="large"
            @click="goToInstructorDashboard"
          >
            前往講師後台
          </el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, SuccessFilled } from '@element-plus/icons-vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['pending', 'approved'].includes(value)
  }
})

const router = useRouter()

// 圖標組件
const iconComponent = computed(() => {
  return props.status === 'pending' ? Clock : SuccessFilled
})

// 圖標顏色
const iconColor = computed(() => {
  return props.status === 'pending'
    ? 'var(--capy-warning)'
    : 'var(--capy-success)'
})

// 標題
const resultTitle = computed(() => {
  return props.status === 'pending'
    ? '申請審核中'
    : '恭喜成為講師！'
})

// 描述
const resultDescription = computed(() => {
  return props.status === 'pending'
    ? '您的資料已送出，預計 3-5 個工作天完成審核。'
    : '您的申請已通過，現在可以開始建立課程了。'
})

// 返回首頁
const goToHome = () => {
  router.push('/')
}

// 前往講師後台
const goToInstructorDashboard = () => {
  router.push('/instructor/dashboard')
}
</script>

<style scoped>
.status-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: var(--capy-spacing-xl);
}

.status-result {
  max-width: 600px;
  width: 100%;
}

.status-result :deep(.el-result__title) {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin-top: var(--capy-spacing-lg);
}

.status-result :deep(.el-result__subtitle) {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin-top: var(--capy-spacing-md);
  line-height: 1.6;
}

.action-buttons {
  margin-top: var(--capy-spacing-xl);
  display: flex;
  justify-content: center;
  gap: var(--capy-spacing-md);
}

.action-buttons .el-button {
  min-width: 140px;
  padding: 12px 32px;
  font-size: var(--capy-font-size-base);
  border-radius: var(--capy-radius-md);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .status-card-container {
    min-height: 50vh;
    padding: var(--capy-spacing-lg);
  }

  .status-result :deep(.el-result__icon) {
    font-size: 60px !important;
  }

  .status-result :deep(.el-result__title) {
    font-size: var(--capy-font-size-xl);
  }

  .status-result :deep(.el-result__subtitle) {
    font-size: var(--capy-font-size-sm);
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
