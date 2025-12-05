<template>
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    class="profile-edit-dialog"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="dialog-header">
        <el-icon
          v-if="currentView === 'password_change'"
          class="back-icon"
          @click="handleBackToSettings"
        >
          <ArrowLeft />
        </el-icon>
        <span class="dialog-title">{{ modalTitle }}</span>
      </div>
    </template>

    <!-- View 1: Settings (Tabs) -->
    <el-tabs v-if="currentView === 'settings'" v-model="activeTab" class="profile-tabs">
      <!-- Tab 1: Profile -->
      <el-tab-pane label="個人資料" name="profile">
        <div class="tab-content">
          <!-- Avatar Section -->
          <div class="avatar-section">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              accept="image/*"
            >
              <div class="avatar-container">
                <img
                  v-if="previewAvatarUrl || formData.avatarUrl"
                  :src="previewAvatarUrl || formData.avatarUrl"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                <div class="avatar-overlay">
                  <el-icon class="overlay-icon"><Camera /></el-icon>
                  <span class="overlay-text">更換頭像</span>
                </div>
              </div>
            </el-upload>
            <div class="avatar-hint">點擊頭像以更換照片</div>
          </div>

          <!-- Form Section -->
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="80px"
            class="profile-form"
          >
            <el-form-item label="電子郵件" prop="email">
              <el-input
                v-model="formData.email"
                disabled
                placeholder="電子郵件"
                class="disabled-email-input"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="暱稱" prop="nickname">
              <el-input
                v-model="formData.nickname"
                placeholder="請輸入暱稱"
                maxlength="20"
                show-word-limit
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- Tab 2: Security -->
      <el-tab-pane label="安全性" name="security">
        <div class="tab-content security-content">
          <!-- Third-Party Login Section -->
          <div class="security-section">
            <h3 class="section-title-student">第三方登入</h3>
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div class="binding-details">
                  <div class="binding-name">Google</div>
                  <div v-if="isGoogleBound" class="binding-status bound">
                    <el-icon><CircleCheck /></el-icon>
                    <span>已連結</span>
                  </div>
                  <div v-else class="binding-status unbound">
                    <el-icon><CircleClose /></el-icon>
                    <span>未連結</span>
                  </div>
                  <div v-if="isGoogleBound && googleEmail" class="binding-email">
                    {{ googleEmail }}
                  </div>
                </div>
              </div>
              <div class="binding-action">
                <el-button
                  v-if="!isGoogleBound"
                  type="default"
                  plain
                  @click="handleBindGoogle"
                  class="bind-button"
                >
                  連結 Google 帳號
                </el-button>
                <el-button
                  v-else
                  type="danger"
                  plain
                  @click="handleUnlinkGoogle"
                  class="unbind-button"
                >
                  解除連結
                </el-button>
              </div>
            </div>
            <div class="security-hint">
              <el-icon><InfoFilled /></el-icon>
              <span>連結 Google 帳號後，您可以使用 Google 快速登入</span>
            </div>
          </div>

          <!-- Password Section -->
          <div class="security-section">
            <h3 class="section-title-student">密碼</h3>
            <div class="password-item">
              <div class="password-info">
                <el-icon class="password-icon"><Lock /></el-icon>
                <span>變更您的登入密碼</span>
              </div>
              <el-button
                type="default"
                plain
                @click="handleChangePassword"
              >
                變更密碼
              </el-button>
            </div>
          </div>

          <!-- Danger Zone Section -->
          <div class="security-section danger-zone">
            <h3 class="section-title-student danger-title">危險區域</h3>
            <div class="danger-item">
              <div class="danger-info">
                <el-icon class="danger-icon"><Delete /></el-icon>
                <div class="danger-details">
                  <div class="danger-name">刪除帳號</div>
                  <div class="danger-description">
                    永久刪除您的帳號及所有相關資料
                  </div>
                </div>
              </div>
              <el-button
                type="danger"
                plain
                @click="handleDeleteAccount"
                class="delete-account-button"
              >
                <el-icon><Delete /></el-icon>
                刪除帳號
              </el-button>
            </div>
            <div class="danger-warning">
              <el-icon><WarningFilled /></el-icon>
              <span>此操作無法復原，您將失去所有已購買課程的存取權限</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- View 2: Password Change Form -->
    <div v-else class="password-change-view">
      <StudentPasswordForm ref="passwordFormRef" />
    </div>

    <!-- Footer -->
    <template #footer>
      <!-- Settings View Footer -->
      <div v-if="currentView === 'settings' && activeTab === 'profile'" class="dialog-footer">
        <el-button @click="handleCancel" size="large" :disabled="isLoading">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
          :loading="isLoading"
          size="large"
          class="save-button"
        >
          儲存變更
        </el-button>
      </div>

      <!-- Password Change View Footer -->
      <div v-if="currentView === 'password_change'" class="dialog-footer">
        <el-button @click="handleBackToSettings" size="large">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleUpdatePassword"
          :loading="updatingPassword"
          size="large"
          class="update-password-button"
        >
          更新密碼
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, h } from 'vue'
import { ElMessage, ElMessageBox, ElInput } from 'element-plus'

// ===== 除錯程式碼開始 =====
console.log('=== StudentProfileEditDialog 載入 ===')
// ===== 除錯程式碼結束 =====
import {
  Plus,
  Camera,
  Message,
  User,
  CircleCheck,
  CircleClose,
  InfoFilled,
  Lock,
  ArrowLeft,
  Delete,
  WarningFilled
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import StudentPasswordForm from './StudentPasswordForm.vue'
import {
  updateStudentProfile,
  uploadStudentAvatar,
  updateStudentPassword,
  deleteStudentAccount,
  getStudentProfile,
  bindGoogleAccount,
  unlinkGoogleAccount
} from '@/api/student/Studentcenter'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    default: () => ({
      email: '',
      nickname: '',
      avatarUrl: '',
      google_id: null,
      google_email: null
    })
  },
  // For backward compatibility
  currentUser: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible', 'save'])

// Refs
const formRef = ref(null)
const passwordFormRef = ref(null)
const isLoading = ref(false)
const uploading = ref(false)
const updatingPassword = ref(false)
const activeTab = ref('profile')
const currentView = ref('settings') // 'settings' | 'password_change'
const deletingAccount = ref(false)
const previewAvatarUrl = ref('') // 本地預覽 URL
const pendingAvatarFile = ref(null) // 待上傳的檔案

// Router and Store
const router = useRouter()
const userStore = useUserStore()

// Form Data
const formData = ref({
  email: '',
  nickname: '',
  avatarUrl: ''
})

// Computed - Use 'user' prop or fallback to 'currentUser' for backward compatibility
const currentUserData = computed(() => {
  // 優先使用 props，如果沒有則使用 userStore
  const data = props.currentUser || props.user || userStore.userInfo
  console.log('=== currentUserData computed ===', data)
  return data
})

// Computed - Check if Google account is bound
const isGoogleBound = computed(() => {
  console.log('=== isGoogleBound computed ===')
  console.log('currentUserData.value:', currentUserData.value)
  console.log('googleLinked:', currentUserData.value.googleLinked)
  console.log('google_id:', currentUserData.value.google_id)

  // 優先使用後端提供的 googleLinked 欄位
  if (currentUserData.value.googleLinked !== undefined) {
    console.log('✅ 使用 googleLinked:', currentUserData.value.googleLinked)
    return currentUserData.value.googleLinked
  }
  // 向下相容：檢查 google_id
  const result = !!currentUserData.value.google_id
  console.log('⚠️ 使用 google_id, 結果:', result)
  return result
})

// Computed - Get Google email if available
const googleEmail = computed(() => {
  return currentUserData.value.google_email || null
})

// Computed - Modal Title
const modalTitle = computed(() => {
  return currentView.value === 'password_change' ? '變更密碼' : '帳號設定'
})

// Dialog Visible (v-model)
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    emit('update:visible', val)
    // Reset view when closing
    if (!val) {
      currentView.value = 'settings'
      activeTab.value = 'profile'
      // 清理預覽
      cleanupPreview()
    }
  }
})

// 清理預覽資源
const cleanupPreview = () => {
  if (previewAvatarUrl.value) {
    URL.revokeObjectURL(previewAvatarUrl.value)
    previewAvatarUrl.value = ''
  }
  pendingAvatarFile.value = null
}

// 暱稱唯一性驗證
const validateNicknameUnique = async (rule, value, callback) => {
  if (!value) {
    return callback()
  }

  // 如果暱稱沒有改變，跳過驗證
  if (value === currentUserData.value.nickname) {
    return callback()
  }

  try {
    // TODO: 實作暱稱檢查 API
    // import { checkNicknameAvailability } from '@/api/student/Studentcenter'
    // const response = await checkNicknameAvailability(value)
    // if (!response.available) {
    //   return callback(new Error('此暱稱已被使用'))
    // }

    callback()
  } catch (error) {
    console.error('Nickname validation error:', error)
    callback()
  }
}

// Form Validation Rules
const rules = {
  nickname: [
    { required: true, message: '請輸入暱稱', trigger: 'blur' },
    { min: 2, max: 20, message: '暱稱長度應在 2 到 20 個字元之間', trigger: 'blur' },
    { validator: validateNicknameUnique, trigger: 'blur' }
  ]
}

// Watch for dialog visibility to fetch fresh profile data
watch(
  () => props.visible,
  async (isVisible) => {
    if (isVisible) {
      try {
        // 獲取最新的個人資料
        const response = await getStudentProfile()

        console.log('獲取到的個人資料:', response)

        // 從 studentProfile 物件中提取資料
        const profileData = response.studentProfile || response

        // 更新 formData
        formData.value = {
          email: profileData.email || currentUserData.value.email || '',
          nickname: profileData.nickname || currentUserData.value.nickname || '',
          avatarUrl: profileData.avatarUrl || currentUserData.value.avatarUrl || currentUserData.value.avatar || ''
        }

        console.log('設定後的 formData:', formData.value)

        // 同時更新 userStore 以確保資料一致（包含 googleLinked）
        if (profileData.email) {
          userStore.updateUserInfo({
            id: profileData.userId || userStore.userInfo.id,
            email: profileData.email,
            nickname: profileData.nickname,
            avatar: profileData.avatarUrl || userStore.userInfo.avatar,
            googleLinked: profileData.googleLinked ?? userStore.userInfo.googleLinked,
            google_id: profileData.googleId || userStore.userInfo.google_id,
            google_email: profileData.googleEmail || userStore.userInfo.google_email
          })
        }
      } catch (error) {
        console.error('獲取個人資料失敗:', error)
        // 如果獲取失敗，使用現有資料
        formData.value = {
          email: currentUserData.value.email || '',
          nickname: currentUserData.value.nickname || '',
          avatarUrl: currentUserData.value.avatarUrl || currentUserData.value.avatar || ''
        }
      }
      // 清理舊的預覽
      cleanupPreview()
    }
  }
)

// Watch for prop changes to update form data
watch(
  () => currentUserData.value,
  (newUser) => {
    if (newUser && !props.visible) {
      formData.value = {
        email: newUser.email || '',
        nickname: newUser.nickname || '',
        avatarUrl: newUser.avatarUrl || newUser.avatar || ''
      }
      // 清理舊的預覽
      cleanupPreview()
    }
  },
  { immediate: true, deep: true }
)

// 處理頭像選擇（本地預覽）
const handleAvatarChange = (file) => {
  if (!file || !file.raw) return

  // 清理舊的預覽 URL
  cleanupPreview()

  // 創建本地預覽 URL
  previewAvatarUrl.value = URL.createObjectURL(file.raw)
  pendingAvatarFile.value = file.raw
}

// Avatar Upload Handler
const handleAvatarUpload = async (options) => {
  const { file } = options

  uploading.value = true

  try {
    // 使用 API 函數上傳頭像（直接傳遞 file）
    const data = await uploadStudentAvatar(file)

    // Update avatar URL with the returned URL from GCS
    formData.value.avatarUrl = data.url || data.avatarUrl

    ElMessage.success('頭像上傳成功')
  } catch (error) {
    console.error('Avatar upload error:', error)
    ElMessage.error(error.message || '頭像上傳失敗，請稍後再試')
  } finally {
    uploading.value = false
  }
}

// Before Avatar Upload Validation
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上傳圖片檔案！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('圖片大小不能超過 5MB！')
    return false
  }
  return true
}

// Handle Bind Google Account
const handleBindGoogle = async () => {
  try {
    // 直接跳轉到 Google OAuth 授權頁面（不先要求密碼）
    ElMessage.info('正在跳轉至 Google 授權頁面...')

    // 標記為綁定流程
    sessionStorage.setItem('oauth_redirect', window.location.pathname)
    sessionStorage.setItem('oauth_action', 'bind_google')

    // 跳轉到 Google OAuth 授權頁面
    const bindUrl = 'http://localhost:8080/api/oauth2/authorization/google'
    window.location.href = bindUrl

  } catch (error) {
    console.error('Google 綁定錯誤:', error)
    ElMessage.error('綁定失敗，請稍後再試')
  }
}

// Handle Unlink Google Account
const handleUnlinkGoogle = async () => {
  try {
    // 顯示確認對話框
    await ElMessageBox.confirm(
      '解除連結後，您將無法使用 Google 帳號登入。確定要解除連結嗎？',
      '解除 Google 帳號連結',
      {
        confirmButtonText: '確認解除',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true,
        closeOnClickModal: false
      }
    )

    // 顯示密碼輸入對話框以驗證使用者身份
    const { value: password } = await ElMessageBox.prompt(
      '為了安全起見，請輸入您的帳號密碼以確認解除連結',
      '驗證身份',
      {
        confirmButtonText: '確認解除',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '請輸入密碼',
        inputValidator: (value) => {
          if (!value) {
            return '請輸入密碼'
          }
          if (value.length < 6) {
            return '密碼長度至少需要 6 個字元'
          }
          return true
        },
        inputErrorMessage: '密碼格式不正確',
        customClass: 'google-bind-password-prompt'
      }
    )

    if (!password) {
      return
    }

    // 調用解除綁定 API
    const response = await unlinkGoogleAccount({ password })

    if (response.success) {
      ElMessage.success(response.message || 'Google 帳號已解除連結')

      // 更新使用者資訊，移除 Google 綁定資料
      userStore.updateUserInfo({
        ...userStore.userInfo,
        google_id: null,
        google_email: null
      })

      // 重新獲取個人資料以確保資料同步
      try {
        const profileData = await getStudentProfile()
        if (profileData.studentProfile) {
          userStore.updateUserInfo({
            id: profileData.studentProfile.userId || userStore.userInfo.id,
            email: profileData.studentProfile.email,
            nickname: profileData.studentProfile.nickname,
            avatar: profileData.studentProfile.avatarUrl || userStore.userInfo.avatar,
            google_id: profileData.studentProfile.googleId || null,
            google_email: profileData.studentProfile.googleEmail || null
          })
        }
      } catch (error) {
        console.error('獲取個人資料失敗:', error)
      }
    } else {
      throw new Error(response.message || '解除連結失敗')
    }

  } catch (error) {
    // 使用者取消或發生錯誤
    if (error !== 'cancel' && error !== 'close') {
      console.error('解除 Google 綁定錯誤:', error)
      ElMessage.error(error.message || '解除連結失敗，請稍後再試')
    }
  }
}

// Handle Change Password
const handleChangePassword = () => {
  currentView.value = 'password_change'
}

// Handle Back to Settings
const handleBackToSettings = () => {
  currentView.value = 'settings'
  passwordFormRef.value?.resetForm()
}

// Handle Update Password
const handleUpdatePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    // Validate password form
    const isValid = await passwordFormRef.value.validate()
    if (!isValid) return

    updatingPassword.value = true

    // Get form data
    const passwordData = passwordFormRef.value.getFormData()

    // 使用 API 函數更新密碼
    await updateStudentPassword(passwordData)

    ElMessage.success('密碼更新成功')

    // Reset form and go back to settings
    passwordFormRef.value.resetForm()
    currentView.value = 'settings'

  } catch (error) {
    console.error('Password update error:', error)
    ElMessage.error(error.message || '密碼更新失敗，請稍後再試')
  } finally {
    updatingPassword.value = false
  }
}

// Handle Cancel
const handleCancel = () => {
  dialogVisible.value = false
  // Reset form to original values
  const userData = currentUserData.value
  formData.value = {
    email: userData.email || '',
    nickname: userData.nickname || '',
    avatarUrl: userData.avatarUrl || userData.avatar || ''
  }
  formRef.value?.clearValidate()
  // Reset to profile tab and settings view
  activeTab.value = 'profile'
  currentView.value = 'settings'
  // 清理預覽
  cleanupPreview()
}

// Handle Save
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // Validate form
    await formRef.value.validate()

    // 防止重複提交
    if (isLoading.value) return

    isLoading.value = true

    // 如果有待上傳的頭像，先上傳
    if (pendingAvatarFile.value) {
      await handleAvatarUpload({ file: pendingAvatarFile.value })
    }

    // 使用 API 函數更新個人資料
    const result = await updateStudentProfile({
      nickname: formData.value.nickname,
      avatarUrl: formData.value.avatarUrl
    })

    // 更新 user store
    if (result) {
      userStore.updateUserInfo({
        id: result.userId || result.id,
        nickname: result.nickname,
        avatar: result.avatarUrl || result.avatar,
        email: result.email
      })
    }

    ElMessage.success('個人資料已更新')

    // 清理預覽資源
    cleanupPreview()

    // 關閉對話框
    dialogVisible.value = false

    // Emit save event for parent component (optional)
    emit('save', result)

  } catch (error) {
    console.error('Update profile error:', error)
    ElMessage.error(error.message || '更新失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
}

// Handle Delete Account
const handleDeleteAccount = async () => {
  try {
    // Show confirmation dialog with input validation
    await ElMessageBox({
      title: '刪除帳號？',
      message: h('div', { class: 'delete-account-content' }, [
        h('div', { class: 'delete-warning' }, [
          h('p', [h('strong', '您確定要刪除您的帳號嗎？')]),
          h('p', { class: 'warning-highlight' }, '您將永久失去所有已購買課程的存取權限。')
        ]),
        h('div', { class: 'delete-input-section' }, [
          h('p', { class: 'input-label' }, [
            '請輸入 ',
            h('strong', 'DELETE'),
            ' 以確認：'
          ]),
          h(ElInput, {
            modelValue: '',
            placeholder: '輸入 DELETE',
            class: 'delete-confirm-input',
            'onUpdate:modelValue': (val) => {
              // Store the input value for validation
              if (window.__deleteConfirmValue !== undefined) {
                window.__deleteConfirmValue = val
              }
            },
            onMounted: () => {
              window.__deleteConfirmValue = ''
            }
          })
        ])
      ]),
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
      type: 'error',
      showClose: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      customClass: 'delete-account-dialog',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          const inputValue = window.__deleteConfirmValue?.trim()
          if (inputValue !== 'DELETE') {
            ElMessage.error('請輸入 DELETE 以確認刪除')
            return false
          }
        }
        done()
      }
    })

    // If confirmed, proceed with deletion
    deletingAccount.value = true

    try {
      // 使用 API 函數刪除帳號
      await deleteStudentAccount()

      ElMessage.success('帳號已刪除')

      // Close the dialog
      dialogVisible.value = false

      // Logout and redirect to home
      await userStore.logout()

      // Redirect to home page
      await router.push('/')

    } catch (error) {
      console.error('Delete account error:', error)
      ElMessage.error(error.message || '刪除帳號失敗，請稍後再試')
    } finally {
      deletingAccount.value = false
    }

  } catch (error) {
    // User cancelled or closed the dialog
    if (error !== 'cancel' && error !== 'close') {
      console.error('Delete account dialog error:', error)
    }
  }
}
</script>

<style scoped>
.profile-edit-dialog {
  border-radius: var(--capy-radius-lg);
}

.profile-edit-dialog :deep(.el-dialog__header) {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-light);
}

.profile-edit-dialog :deep(.el-dialog__body) {
  padding: var(--capy-spacing-md);
}

.profile-edit-dialog :deep(.el-dialog__footer) {
  padding: var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-light);
}

/* Tabs */
.profile-tabs {
  margin: 0;
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  padding: 0 var(--capy-spacing-lg);
}

.profile-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0;
}

.profile-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--capy-border-light);
}

.profile-tabs :deep(.el-tabs__item) {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-secondary);
  padding: var(--capy-spacing-md) var(--capy-spacing-md);
  height: 48px;
  line-height: 48px;
}

.profile-tabs :deep(.el-tabs__item.is-active) {
  color: var(--capy-primary);
}

.profile-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--capy-primary);
  height: 2px;
}

.tab-content {
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xl);
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--capy-spacing-sm);
}

.avatar-uploader {
  cursor: pointer;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: var(--capy-radius-circle);
  overflow: hidden;
  border: 3px solid var(--capy-border-light);
  transition: all var(--capy-transition-base);
}

.avatar-container:hover {
  border-color: var(--capy-primary);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-uploader-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--capy-text-placeholder);
  background-color: var(--capy-bg-base);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--capy-spacing-xs);
  opacity: 0;
  transition: opacity var(--capy-transition-base);
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 32px;
  color: white;
}

.overlay-text {
  font-size: var(--capy-font-size-sm);
  color: white;
  font-weight: var(--capy-font-weight-medium);
}

.avatar-hint {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  text-align: center;
}

/* Form Section */
.profile-form {
  width: 100%;
}

.profile-form :deep(.el-form-item__label) {
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
}

/* 改善 Email 輸入框的可讀性 */
.disabled-email-input :deep(.el-input__wrapper) {
  background-color: var(--capy-bg-base);
  cursor: not-allowed;
}

.disabled-email-input :deep(.el-input__inner) {
  color: var(--el-text-color-regular) !important;
  -webkit-text-fill-color: var(--el-text-color-regular) !important;
}

.profile-form :deep(.el-input__prefix) {
  color: var(--capy-text-secondary);
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--capy-spacing-sm);
}

.save-button {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.save-button:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.save-button:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

/* Security Tab */
.security-content {
  gap: var(--capy-spacing-2xl);
}

.security-section {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
}

.section-title-student {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
  padding-bottom: var(--capy-spacing-sm);
  border-bottom: 1px solid var(--capy-border-light);
}

/* Binding Item */
.binding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.binding-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.binding-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.binding-details {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.binding-name {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.binding-status {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
}

.binding-status.bound {
  color: var(--el-color-success);
}

.binding-status.unbound {
  color: var(--capy-text-secondary);
}

.binding-email {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.binding-action .bind-button {
  color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.binding-action .bind-button:hover {
  background-color: var(--capy-primary);
  color: white;
}

.binding-action .unbind-button {
  color: var(--capy-danger);
  border-color: var(--capy-danger);
}

.binding-action .unbind-button:hover {
  background-color: var(--capy-danger);
  color: white;
}

.security-hint {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  background-color: var(--el-color-info-light-9);
  border-radius: var(--capy-radius-sm);
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.security-hint .el-icon {
  color: var(--el-color-info);
}

/* Password Item */
.password-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.password-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
}

.password-icon {
  font-size: 20px;
  color: var(--capy-text-secondary);
}

/* Custom Header */
.dialog-header {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.back-icon {
  font-size: 20px;
  color: var(--capy-text-secondary);
  cursor: pointer;
  transition: color var(--capy-transition-base);
}

.back-icon:hover {
  color: var(--capy-primary);
}

.dialog-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

/* Password Change View */
.password-change-view {
  padding: var(--capy-spacing-lg) var(--capy-spacing-md);
  min-height: 400px;
}

.update-password-button {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.update-password-button:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.update-password-button:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}
/* Danger Zone Section */
.danger-zone {
  margin-top: var(--capy-spacing-xl);
  padding-top: var(--capy-spacing-xl);
  border-top: 2px solid var(--capy-danger);
}

.danger-title {
  color: var(--capy-danger);
  border-bottom-color: var(--capy-danger);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg);
  background-color: #FEF0F0;
  border-radius: var(--capy-radius-md);
  border: 1px solid #FBC4C4;
}

.danger-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.danger-icon {
  font-size: 24px;
  color: var(--capy-danger);
}

.danger-details {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.danger-name {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-danger);
}

.danger-description {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.delete-account-button {
  color: var(--capy-danger);
  border-color: var(--capy-danger);
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
}

.delete-account-button:hover {
  background-color: var(--capy-danger);
  color: white;
}

.delete-account-button:active {
  background-color: #F56C6C;
  border-color: #F56C6C;
}

.danger-warning {
  display: flex;
  align-items: flex-start;
  gap: var(--capy-spacing-xs);
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  background-color: #FEF0F0;
  border-radius: var(--capy-radius-sm);
  border: 1px solid #FBC4C4;
  font-size: var(--capy-font-size-sm);
  color: var(--capy-danger);
  line-height: 1.5;
}

.danger-warning .el-icon {
  color: var(--capy-danger);
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}


/* Responsive */
@media (max-width: 768px) {
  .profile-edit-dialog {
    width: 90% !important;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .overlay-icon {
    font-size: 24px;
  }

  .overlay-text {
    font-size: var(--capy-font-size-xs);
  }

  .binding-item,
  .password-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--capy-spacing-md);
  }

  .binding-action,
  .password-item > .el-button {
    width: 100%;
  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--capy-spacing-md);
  }

  .delete-account-button {
    width: 100%;
  }
  }
}
</style>

<style>
/* Global styles for delete account dialog */
.delete-account-dialog {
  border-radius: var(--capy-radius-lg);
  max-width: 500px;
}

.delete-account-dialog .el-message-box__header {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-light);
}

.delete-account-dialog .el-message-box__title {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-danger);
}

.delete-account-dialog .el-message-box__content {
  padding: var(--capy-spacing-lg);
}

.delete-account-content {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-lg);
}

.delete-warning {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

.delete-warning p {
  margin: 0;
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
  line-height: 1.6;
}

.delete-warning .warning-highlight {
  color: var(--capy-danger);
  font-weight: var(--capy-font-weight-semibold);
  background-color: #FEF0F0;
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  border-radius: var(--capy-radius-sm);
  border-left: 3px solid var(--capy-danger);
}

.delete-input-section {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

.input-label {
  margin: 0;
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.input-label strong {
  color: var(--capy-danger);
  font-family: monospace;
  font-size: var(--capy-font-size-base);
}

.delete-confirm-input {
  width: 100%;
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  border: 2px solid var(--capy-border-base);
  border-radius: var(--capy-radius-sm);
  font-size: var(--capy-font-size-base);
  font-family: monospace;
  transition: border-color var(--capy-transition-base);
}

.delete-confirm-input:focus {
  outline: none;
  border-color: var(--capy-danger);
}

.delete-account-dialog .el-message-box__btns {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-light);
}

.delete-account-dialog .el-button--primary {
  background-color: var(--capy-danger);
  border-color: var(--capy-danger);
}

.delete-account-dialog .el-button--primary:hover {
  background-color: #F56C6C;
  border-color: #F56C6C;
}

.delete-account-dialog .el-button--primary:active {
  background-color: #DD6161;
  border-color: #DD6161;
}

.delete-account-dialog .el-message-box__input {
  display: none;
}

/* Google Bind Password Prompt Styles */
.google-bind-password-prompt {
  border-radius: var(--capy-radius-lg);
  max-width: 450px;
}

.google-bind-password-prompt .el-message-box__header {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-light);
}

.google-bind-password-prompt .el-message-box__title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.google-bind-password-prompt .el-message-box__content {
  padding: var(--capy-spacing-xl) var(--capy-spacing-lg);
}

.google-bind-password-prompt .el-message-box__message {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--capy-spacing-lg);
}

.google-bind-password-prompt .el-message-box__input {
  padding-top: var(--capy-spacing-md);
}

.google-bind-password-prompt .el-input__wrapper {
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  border-radius: var(--capy-radius-sm);
  box-shadow: 0 0 0 1px var(--capy-border-base) inset;
  transition: all var(--capy-transition-base);
}

.google-bind-password-prompt .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--capy-primary) inset;
}

.google-bind-password-prompt .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px var(--capy-primary) inset;
}

.google-bind-password-prompt .el-input__inner {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
}

.google-bind-password-prompt .el-input__inner::placeholder {
  color: var(--capy-text-placeholder);
}

.google-bind-password-prompt .el-message-box__errormsg {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-danger);
  margin-top: var(--capy-spacing-xs);
  padding-left: var(--capy-spacing-xs);
}

.google-bind-password-prompt .el-message-box__btns {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-light);
  display: flex;
  gap: var(--capy-spacing-sm);
  justify-content: flex-end;
}

.google-bind-password-prompt .el-button {
  padding: var(--capy-spacing-sm) var(--capy-spacing-lg);
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  border-radius: var(--capy-radius-sm);
  transition: all var(--capy-transition-base);
}

.google-bind-password-prompt .el-button--default {
  color: var(--capy-text-secondary);
  border-color: var(--capy-border-base);
}

.google-bind-password-prompt .el-button--default:hover {
  color: var(--capy-text-primary);
  border-color: var(--capy-border-dark);
  background-color: var(--capy-bg-base);
}

.google-bind-password-prompt .el-button--primary {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  color: white;
}

.google-bind-password-prompt .el-button--primary:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.google-bind-password-prompt .el-button--primary:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .google-bind-password-prompt {
    max-width: 90%;
    margin: 0 auto;
  }

  .google-bind-password-prompt .el-message-box__header,
  .google-bind-password-prompt .el-message-box__content,
  .google-bind-password-prompt .el-message-box__btns {
    padding-left: var(--capy-spacing-md);
    padding-right: var(--capy-spacing-md);
  }

  .google-bind-password-prompt .el-message-box__btns {
    flex-direction: column;
  }

  .google-bind-password-prompt .el-button {
    width: 100%;
  }
}
</style>
