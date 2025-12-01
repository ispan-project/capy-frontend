<template>
  <div class="profile-edit-example">
    <h2>個人資料編輯對話框範例</h2>
    
    <!-- Current User Info Display -->
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <span>目前使用者資訊</span>
          <el-tag v-if="currentUser.google_id" type="success" size="small">
            已綁定 Google
          </el-tag>
        </div>
      </template>
      
      <div class="user-info">
        <img v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" class="user-avatar" />
        <div class="user-details">
          <p><strong>暱稱：</strong>{{ currentUser.nickname }}</p>
          <p><strong>電子郵件：</strong>{{ currentUser.email }}</p>
          <p v-if="currentUser.google_email" class="google-info">
            <el-icon><Connection /></el-icon>
            <strong>Google 帳號：</strong>{{ currentUser.google_email }}
          </p>
        </div>
      </div>
    </el-card>

    <!-- Action Buttons -->
    <div class="actions">
      <el-button type="primary" size="large" @click="openDialog">
        編輯個人資料
      </el-button>
      <el-button size="large" @click="toggleGoogleBinding">
        {{ currentUser.google_id ? '模擬解除綁定' : '模擬綁定 Google' }}
      </el-button>
    </div>

    <!-- Profile Edit Dialog -->
    <StudentProfileEditDialog
      v-model:visible="dialogVisible"
      :user="currentUser"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection } from '@element-plus/icons-vue'
import StudentProfileEditDialog from './StudentProfileEditDialog.vue'

// Dialog visibility
const dialogVisible = ref(false)

// Mock current user data with Google binding info
const currentUser = ref({
  email: 'student@example.com',
  nickname: '學習者小明',
  avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  google_id: null,
  google_email: null
})

// Open dialog
const openDialog = () => {
  dialogVisible.value = true
}

// Toggle Google binding (for testing purposes)
const toggleGoogleBinding = () => {
  if (currentUser.value.google_id) {
    currentUser.value.google_id = null
    currentUser.value.google_email = null
    ElMessage.info('已模擬解除 Google 綁定')
  } else {
    currentUser.value.google_id = 'mock_google_id_123'
    currentUser.value.google_email = 'student@gmail.com'
    ElMessage.success('已模擬綁定 Google 帳號')
  }
}

// Handle save
const handleSave = async (updatedData) => {
  try {
    // TODO: Replace with actual API call
    // Example API call:
    /*
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        nickname: updatedData.nickname,
        avatar_url: updatedData.avatarUrl
      })
    })

    if (!response.ok) {
      throw new Error('更新失敗')
    }

    const data = await response.json()
    */

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update local user data
    currentUser.value.nickname = updatedData.nickname
    currentUser.value.avatarUrl = updatedData.avatarUrl

    // Close dialog
    dialogVisible.value = false

    // Show success message
    ElMessage.success('個人資料更新成功！')

    // Optional: Update user store
    // import { useUserStore } from '@/stores/user'
    // const userStore = useUserStore()
    // userStore.userInfo.nickname = updatedData.nickname
    // userStore.userInfo.avatar = updatedData.avatarUrl

  } catch (error) {
    console.error('Save profile error:', error)
    ElMessage.error('個人資料更新失敗，請稍後再試')
  }
}
</script>

<style scoped>
.profile-edit-example {
  padding: var(--capy-spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.profile-edit-example h2 {
  margin-bottom: var(--capy-spacing-lg);
  color: var(--capy-text-primary);
}

.user-info-card {
  margin-bottom: var(--capy-spacing-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--capy-font-weight-semibold);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--capy-radius-circle);
  object-fit: cover;
  border: 2px solid var(--capy-border-light);
}

.user-details {
  flex: 1;
}

.user-details p {
  margin: var(--capy-spacing-xs) 0;
  color: var(--capy-text-regular);
}

.user-details strong {
  color: var(--capy-text-primary);
}

.google-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  color: var(--el-color-success);
}

.google-info .el-icon {
  font-size: 16px;
}

.actions {
  display: flex;
  gap: var(--capy-spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}
</style>