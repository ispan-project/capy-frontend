<template>
  <div class="become-instructor-page">
    <!-- Loading State -->
    <div v-if="pageState === 'LOADING'" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- Content -->
    <template v-else>
      <div class="page-header">
        <h1 class="page-title">成為講師</h1>
        <p class="page-subtitle">分享您的專業知識，開啟教學之旅</p>
      </div>

      <!-- Rejection Alert (Only for REJECTED state) -->
      <el-alert
        v-if="pageState === 'REJECTED' && applicationData?.rejectionReason"
        type="error"
        :title="'申請未通過'"
        :description="applicationData.rejectionReason"
        :closable="false"
        show-icon
        class="rejection-alert"
      />

      <!-- Status Card (PENDING or APPROVED) -->
      <StatusCard
        v-if="pageState === 'PENDING' || pageState === 'APPROVED'"
        :status="pageState.toLowerCase()"
      />

      <!-- Application Wizard (NEW or REJECTED) -->
      <InstructorApplicationWizard
        v-if="pageState === 'NEW' || pageState === 'REJECTED'"
        ref="wizardRef"
        :initial-data="initialFormData"
        :is-resubmission="pageState === 'REJECTED'"
        @submit-success="handleSubmitSuccess"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import InstructorApplicationWizard from '@/components/student/BecomeTeacher/InstructorApplicationWizard.vue'
import StatusCard from '@/components/student/BecomeTeacher/StatusCard.vue'
import { getLatestApplication } from '@/api/student/becomTeacher.js'

// Page State: LOADING | NEW | PENDING | APPROVED | REJECTED
const pageState = ref('LOADING')
const applicationData = ref(null)
const wizardRef = ref(null)

// 將 API 資料映射為表單初始資料
const initialFormData = computed(() => {
  if (pageState.value !== 'REJECTED' || !applicationData.value) {
    return null
  }

  const data = applicationData.value

  return {
    full_name: data.fullName || '',
    bank_code: data.bankCode || '',
    account_number: data.accountNumber || '',
    resume: data.resume || '',
    work_experience: (data.workExperiences || []).map(exp => ({
      start_date: exp.startDate ? exp.startDate.substring(0, 7) : '', // 2022-01-01 -> 2022-01
      end_date: exp.endDate ? exp.endDate.substring(0, 7) : '',
      company: exp.companyName || '',
      position: exp.jobTitle || ''
    })),
    // 證書文件需要特殊處理 - 標記為已存在的文件
    certificates: (data.certificates || []).map(cert => ({
      certificateId: cert.certificateId,
      name: cert.fileName,
      url: cert.filePath,
      status: 'success',
      isExisting: true // 標記為已存在的文件
    }))
  }
})

// 載入申請狀態
const loadApplicationStatus = async () => {
  try {
    pageState.value = 'LOADING'

    const response = await getLatestApplication()

    console.log('API Response:', response)

    // API 回應結構：response 本身就包含申請資料
    const applicationInfo = response

    console.log('Application Info:', applicationInfo)

    // 檢查是否有申請記錄（如果 response 為 null 或沒有 status）
    if (!applicationInfo || !applicationInfo.status) {
      // 從未申請過或 API 回應為空
      console.log('No application found, setting state to NEW')
      pageState.value = 'NEW'
      return
    }

    // 儲存申請資料
    applicationData.value = applicationInfo

    // 根據狀態設定頁面狀態
    const status = applicationInfo.status?.toUpperCase()

    console.log('Application Status:', status)

    if (status === 'PENDING') {
      console.log('Setting page state to PENDING')
      pageState.value = 'PENDING'
    } else if (status === 'APPROVED') {
      console.log('Setting page state to APPROVED')
      pageState.value = 'APPROVED'
    } else if (status === 'REJECTED') {
      console.log('Setting page state to REJECTED')
      pageState.value = 'REJECTED'
    } else {
      // 未知狀態，預設為 NEW
      console.log('Unknown status, setting state to NEW')
      pageState.value = 'NEW'
    }

    console.log('Final page state:', pageState.value)

  } catch (error) {
    console.error('Failed to load application status:', error)
    ElMessage.error('載入申請狀態失敗，請重新整理頁面')
    // 發生錯誤時預設為 NEW 狀態
    pageState.value = 'NEW'
  }
}

// 處理提交成功
const handleSubmitSuccess = () => {
  // 重新載入狀態
  loadApplicationStatus()
}

// 頁面載入時取得申請狀態
onMounted(() => {
  loadApplicationStatus()
})
</script>

<style scoped>
.become-instructor-page {
  min-height: 100vh;
  background-color: var(--capy-bg-base);
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
}

.loading-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--capy-spacing-xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--capy-spacing-xxl);
}

.page-title {
  font-size: 36px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.page-subtitle {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* Rejection Alert */
.rejection-alert {
  max-width: 900px;
  margin: 0 auto var(--capy-spacing-xl) auto;
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
}

.rejection-alert :deep(.el-alert__title) {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  margin-bottom: var(--capy-spacing-sm);
}

.rejection-alert :deep(.el-alert__description) {
  font-size: var(--capy-font-size-base);
  line-height: 1.6;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .become-instructor-page {
    padding: var(--capy-spacing-lg) var(--capy-spacing-sm);
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: var(--capy-font-size-base);
  }

  .rejection-alert {
    padding: var(--capy-spacing-md);
  }

  .rejection-alert :deep(.el-alert__title) {
    font-size: var(--capy-font-size-base);
  }

  .rejection-alert :deep(.el-alert__description) {
    font-size: var(--capy-font-size-sm);
  }
}
</style>
