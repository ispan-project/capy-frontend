<template>
  <div class="login-container">
    <!-- 左側圖片區域 -->
    <div class="left-section">
      <div class="image-wrapper">
        <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop" alt="學習圖片" class="side-image" />
      </div>
    </div>

    <!-- 右側表單區域 -->
    <div class="right-section">
      <div class="form-container">
        <h1 class="title">歡迎</h1>
        <p class="subtitle">請登入或註冊以繼續學習</p>

        <!-- 切換標籤 -->
        <div class="tabs">
          <button
            :class="['tab', { active: activeTab === 'login' }]"
            @click="activeTab = 'login'"
          >
            登入
          </button>
          <button
            :class="['tab', { active: activeTab === 'register' }]"
            @click="activeTab = 'register'"
          >
            註冊
          </button>
        </div>

        <!-- 登入表單 -->
        <div v-if="activeTab === 'login'" class="form-content">
          <div class="form-group">
            <label class="form-label">電子郵件</label>
            <input
              v-model="loginForm.email"
              type="email"
              class="form-input"
              placeholder="輸入電子郵件"
            />
          </div>

          <div class="form-group">
            <label class="form-label">密碼</label>
            <div class="password-input-wrapper">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="輸入密碼"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <el-icon>
                  <View v-if="!showPassword" />
                  <Hide v-else />
                </el-icon>
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <router-link to="/forgot-password" class="link">忘記密碼？</router-link>
          </div>

          <button class="submit-button" @click="handleLogin">登入</button>
          <button class="google-button" @click="handleGoogleLogin">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 繼續
          </button>
        </div>

        <!-- 註冊表單 -->
        <div v-else class="form-content">
          <!-- 註冊成功狀態 -->
          <div v-if="isRegisterSuccess" class="success-state">
            <div class="success-icon">
              <el-icon :size="64" color="var(--capy-primary)">
                <Message />
              </el-icon>
            </div>
            <h2 class="success-title">驗證郵件已發送</h2>
            <p class="success-description">
              我們已將驗證連結發送至 <strong>{{ registeredEmail }}</strong>。<br />
              請檢查您的收件匣以啟用您的帳號。
            </p>
            <button class="submit-button" @click="isRegisterSuccess = false; activeTab = 'login'">
              返回登入
            </button>
          </div>

          <!-- 註冊表單 -->
          <div v-else>
          <div class="form-group">
            <label class="form-label">使用者名稱</label>
            <input
              v-model="registerForm.username"
              type="text"
              class="form-input"
              placeholder="輸入使用者名稱"
              @input="handleUsernameInput"
            />
            <div v-if="usernameValidation.message" :class="['validation-message', usernameValidation.type]">
              {{ usernameValidation.message }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">電子郵件</label>
            <input
              v-model="registerForm.email"
              type="email"
              class="form-input"
              placeholder="輸入電子郵件"
              :readonly="!!registerForm.googleId"
              :class="{ 'readonly-input': !!registerForm.googleId }"
            />
            <div v-if="registerForm.googleId" class="info-message">
              此信箱來自 Google 帳號，無法修改
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密碼</label>
            <div class="password-input-wrapper">
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="輸入密碼"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <el-icon>
                  <View v-if="!showPassword" />
                  <Hide v-else />
                </el-icon>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">確認密碼</label>
            <div class="password-input-wrapper">
              <input
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="再次輸入密碼"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <el-icon>
                  <View v-if="!showConfirmPassword" />
                  <Hide v-else />
                </el-icon>
              </button>
            </div>
          </div>

          <div class="checkbox-group">
            <input
              v-model="registerForm.agreeTerms"
              type="checkbox"
              id="terms"
              class="checkbox"
            />
            <label for="terms" class="checkbox-label">我同意服務條款和隱私政策</label>
          </div>

          <button class="submit-button register" @click="handleRegister">建立帳號</button>

          <button class="google-button" @click="handleGoogleLogin">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 繼續
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { View, Hide, Message } from '@element-plus/icons-vue';
import { validateUsername, debounce } from '@/utils/usernameValidator';
import { ElMessage } from 'element-plus';
import { login, register, initiateGoogleOAuth } from '@/api/oauth/oauth';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 當前標籤
const activeTab = ref('login');

// 註冊成功狀態
const isRegisterSuccess = ref(false);
const registeredEmail = ref('');

// 密碼顯示狀態
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 登入表單
const loginForm = reactive({
  email: '',
  password: ''
});

// 註冊表單
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  googleId: '' // 用於儲存 Google ID（如果是從 OAuth 導向過來的）
});

// 使用者名稱驗證結果
const usernameValidation = reactive({
  message: '',
  type: '' // 'success' | 'error' | 'warning'
});

// 使用者名稱驗證函式（帶 debounce）
const validateUsernameDebounced = debounce((username) => {
  const result = validateUsername(username);
  usernameValidation.message = result.message;
  usernameValidation.type = result.type;
}, 300);

// 處理使用者名稱輸入
const handleUsernameInput = () => {
  validateUsernameDebounced(registerForm.username);
};

// 處理登入
const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    ElMessage.error('請填寫所有欄位');
    return;
  }

  try {
    // 呼叫登入 API（後端會自動設定 Cookie）
    const response = await login({
      email: loginForm.email,
      password: loginForm.password
    });

    // 後端回傳格式: { user: { id, email, nickname, role, avatarUrl }, roles: [...] }
    const { user, roles } = response;

    // 儲存使用者資訊到 userStore（不需要 token，Cookie 已由後端設定）
    userStore.login({
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatarUrl || '',
      roles: roles || [user.role], // 使用 roles 陣列，或將單一 role 轉換為陣列
      email: user.email
    });

    ElMessage.success('登入成功！');

    // 檢查是否有原始目標路徑
    const redirectPath = route.query.redirect || '/student/my-learning';

    // 跳轉頁面
    await router.push(redirectPath);
  } catch (error) {
    console.error('登入失敗:', error);

    // 處理被攔截器包裝過的錯誤
    if (error.handled) {
      // 401 錯誤已被攔截器處理，顯示通用錯誤訊息
      if (error.status === 401) {
        ElMessage.error('登入失敗，請檢查您的帳號密碼');
      }
      return;
    }

    // 檢查是否為帳號未驗證或停用的錯誤
    const errorMessage = error.response?.data?.message || error.message || '';
    const status = error.response?.status;

    // 如果是 403 或錯誤訊息包含「未驗證」、「停用」等關鍵字
    if (status === 403 || errorMessage.includes('未驗證') || errorMessage.includes('停用') ||
        errorMessage.includes('not active') || errorMessage.includes('suspended')) {
      ElMessage.warning('您的帳號尚未啟用，請檢查您的電子郵件以完成驗證');
    } else {
      ElMessage.error(errorMessage || '登入失敗，請檢查您的帳號密碼');
    }
  }
};

// 處理註冊
const handleRegister = async () => {
  // 驗證使用者名稱
  const usernameResult = validateUsername(registerForm.username);
  if (!usernameResult.valid) {
    ElMessage.error(usernameResult.message || '使用者名稱不符合規則');
    return;
  }

  // 驗證其他欄位
  if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
    ElMessage.error('請填寫所有欄位');
    return;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.error('兩次密碼輸入不一致');
    return;
  }

  if (!registerForm.agreeTerms) {
    ElMessage.error('請同意服務條款');
    return;
  }

  try {
    // 呼叫註冊 API
    await register({
      email: registerForm.email,
      password: registerForm.password,
      nickname: registerForm.username,
      googleId: registerForm.googleId || undefined // 如果有 Google ID 則一併送出
    });

    // 判斷是否為 Google OAuth 註冊
    if (registerForm.googleId) {
      // Google OAuth 註冊：直接嘗試登入
      ElMessage.success('註冊成功！正在為您登入...');

      try {
        const loginResponse = await login({
          email: registerForm.email,
          password: registerForm.password
        });

        const { user, roles } = loginResponse;

        // 儲存使用者資訊到 userStore
        userStore.login({
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatarUrl || '',
          roles: roles || [user.role],
          email: user.email
        });

        ElMessage.success('登入成功！');

        // 跳轉到學生中心
        const redirectPath = route.query.redirect || '/student/my-learning';
        await router.push(redirectPath);
      } catch (loginError) {
        console.error('自動登入失敗:', loginError);
        ElMessage.warning('註冊成功，請手動登入');
        activeTab.value = 'login';
      }
    } else {
      // 一般註冊：顯示驗證郵件頁面
      registeredEmail.value = registerForm.email;
      isRegisterSuccess.value = true;
      ElMessage.success('註冊成功！請檢查您的電子郵件');
    }
  } catch (error) {
    console.error('註冊失敗:', error);
    ElMessage.error(error.response?.data?.message || error.message || '註冊失敗，請稍後再試');
  }
};

/**
 * 處理 Google 登入
 * 導向後端的 OAuth 授權端點
 */
const handleGoogleLogin = () => {
  console.log(userStore);
  initiateGoogleOAuth();
};

/**
 * 處理 OAuth 回調的三種情境
 * 在元件掛載時檢查 URL 查詢參數
 */
onMounted(() => {
  const { email, googleId, oauthError } = route.query;

  // 情境 1: OAuth 錯誤或帳號停用
  if (oauthError) {
    ElMessage.error(`Google 登入失敗: ${oauthError}`);
    // 清除 URL 中的查詢參數
    router.replace({ path: '/login', query: {} });
    return;
  }

  // 情境 2: 未綁定的 Google 帳號，需要完成註冊/綁定
  if (email && googleId) {
    ElMessage.info('檢測到 Google 帳號，請完成註冊以繼續');

    // 切換到註冊頁籤
    activeTab.value = 'register';

    // 預填 email 和 googleId（可以選擇是否顯示給使用者）
    registerForm.email = email;
    // 將 googleId 儲存起來，註冊時一併送出
    registerForm.googleId = googleId;

    // 清除 URL 中的查詢參數
    router.replace({ path: '/login', query: {} });
    return;
  }
});
</script>

<style scoped>
/* 外層容器 - 全螢幕並置中 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

/* 內層容器 - 固定大小 */
.login-container > .left-section,
.login-container > .right-section {
  height: 680px;
}

.login-container > .left-section {
  width: 620px;
}

.login-container > .right-section {
  width: 520px;
}

/* 左側圖片區域 */
.left-section {
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 20px 0 0 20px;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.05);

}

.image-wrapper {
  max-width: 500px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  height: auto;
}

.side-image {
  width: 100%;
  height: 650px;
  display: block;
  object-fit: cover;
}

/* 右側表單區域 */
.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 0 20px 20px 0;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.05);
}

.form-container {
  width: 100%;
  max-width: 370px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
}

/* 切換標籤 */
.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
}

.tab {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tab.active {
  background: white;
  color: var(--capy-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 表單內容 */
.form-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: var(--capy-primary);
  background: white;
}

.form-input::placeholder {
  color: #999;
}

.form-input.readonly-input {
  background: #f0f0f0;
  color: #666;
  cursor: not-allowed;
  border-color: #d0d0d0;
}

.form-input.readonly-input:focus {
  border-color: #d0d0d0;
  background: #f0f0f0;
}

.info-message {
  margin-top: 8px;
  font-size: 13px;
  color: var(--capy-primary);
  background: var(--el-color-primary-light-9);
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 密碼輸入框 */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--capy-primary);
}

/* 驗證訊息 */
.validation-message {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-message.success {
  color: var(--capy-success);
  background: var(--el-color-success-light-9);
}

.validation-message.error {
  color: var(--capy-danger);
  background: var(--el-color-danger-light-9);
}

/* 忘記密碼 */
.forgot-password {
  text-align: right;
  margin-bottom: 16px;
}

.link {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: var(--capy-primary);
}

/* 提交按鈕 */
.submit-button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: var(--capy-primary);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.submit-button:hover {
  background: var(--el-color-primary-dark-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--capy-primary-rgb), 0.3);
}

.submit-button.register {
  background: var(--capy-success);
}

.submit-button.register:hover {
  background: var(--el-color-success-dark-2);
  box-shadow: 0 8px 20px rgba(103, 194, 58, 0.3);
}

/* API 測試連結 */
.api-test {
  text-align: center;
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--capy-success);
}

.checkbox-label {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  user-select: none;
}

/* Google 按鈕 */
.google-button {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  background: white;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-button:hover {
  border-color: var(--capy-primary);
  background: var(--capy-bg-base);
}

.google-icon {
  flex-shrink: 0;
}

/* 註冊成功狀態 */
.success-state {
  text-align: center;
  padding: 20px 0;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.success-description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-description strong {
  color: var(--capy-primary);
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .left-section {
    min-height: 300px;
  }

  .right-section {
    padding: 40px 20px;
  }
}
</style>
