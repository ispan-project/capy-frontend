<template>
  <div class="example-page">
    <div class="example-header">
      <h1>講師申請嚮導 - 使用範例</h1>
      <p>這是 InstructorApplicationWizard 組件的完整使用範例</p>
    </div>

    <!-- Example 1: Basic Usage -->
    <section class="example-section">
      <h2>範例 1：基本使用</h2>
      <p class="example-description">
        最簡單的使用方式，直接引入組件即可。組件會處理所有的表單驗證和狀態管理。
      </p>
      <div class="example-demo">
        <InstructorApplicationWizard />
      </div>
      <div class="example-code">
        <h3>程式碼：</h3>
        <pre><code>&lt;template&gt;
  &lt;div class="page"&gt;
    &lt;InstructorApplicationWizard /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import InstructorApplicationWizard from '@/components/BecomeTeacher/InstructorApplicationWizard.vue'
&lt;/script&gt;</code></pre>
      </div>
    </section>

    <!-- Example 2: With Custom Wrapper -->
    <section class="example-section">
      <h2>範例 2：自訂包裝容器</h2>
      <p class="example-description">
        在實際使用中，你可能需要添加頁面標題、說明文字或其他內容。
      </p>
      <div class="example-demo">
        <div class="custom-wrapper">
          <div class="page-banner">
            <h1>🎓 成為 CapyCourse 講師</h1>
            <p>分享您的專業知識，影響更多學習者</p>
            <div class="benefits">
              <div class="benefit-item">
                <el-icon><Trophy /></el-icon>
                <span>建立個人品牌</span>
              </div>
              <div class="benefit-item">
                <el-icon><Money /></el-icon>
                <span>獲得額外收入</span>
              </div>
              <div class="benefit-item">
                <el-icon><User /></el-icon>
                <span>影響學習者</span>
              </div>
            </div>
          </div>
          <InstructorApplicationWizard ref="wizardRef" />
        </div>
      </div>
      <div class="example-code">
        <h3>程式碼：</h3>
        <pre><code>&lt;template&gt;
  &lt;div class="custom-wrapper"&gt;
    &lt;div class="page-banner"&gt;
      &lt;h1&gt;🎓 成為 CapyCourse 講師&lt;/h1&gt;
      &lt;p&gt;分享您的專業知識，影響更多學習者&lt;/p&gt;
    &lt;/div&gt;
    &lt;InstructorApplicationWizard ref="wizardRef" /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import InstructorApplicationWizard from '@/components/BecomeTeacher/InstructorApplicationWizard.vue'

const wizardRef = ref(null)
&lt;/script&gt;</code></pre>
      </div>
    </section>

    <!-- Example 3: API Integration -->
    <section class="example-section">
      <h2>範例 3：API 整合說明</h2>
      <p class="example-description">
        組件內建的 API 整合範例。你需要根據實際的後端 API 修改端點和處理邏輯。
      </p>
      <div class="example-code">
        <h3>後端 API 需求：</h3>
        <pre><code>// API Endpoint
POST /api/instructors/apply

// Request Headers
Content-Type: multipart/form-data
Authorization: Bearer {token}

// Request Body (FormData)
{
  full_name: string,          // 姓名
  bank_code: string,          // 銀行代碼 (3 digits)
  account_number: string,     // 銀行帳號
  resume: string,             // 個人簡介
  files[0]: File,             // 證書檔案 1
  files[1]: File,             // 證書檔案 2
  ...                         // 最多 5 個檔案
}

// Response (Success)
{
  success: true,
  message: "申請已送出",
  application_id: "uuid"
}

// Response (Error)
{
  success: false,
  message: "錯誤訊息",
  errors: {
    field: ["錯誤詳情"]
  }
}</code></pre>
      </div>
    </section>

    <!-- Example 4: Customization Tips -->
    <section class="example-section">
      <h2>範例 4：自訂提示</h2>
      <div class="tips-grid">
        <el-card class="tip-card">
          <template #header>
            <div class="card-header">
              <el-icon><Edit /></el-icon>
              <span>修改驗證規則</span>
            </div>
          </template>
          <p>在組件的 <code>profileRules</code> 和 <code>documentsRules</code> 中修改驗證邏輯。</p>
          <pre><code>const profileRules = {
  full_name: [
    { required: true, message: '請輸入姓名' },
    { min: 2, max: 50, message: '長度 2-50' }
  ]
}</code></pre>
        </el-card>

        <el-card class="tip-card">
          <template #header>
            <div class="card-header">
              <el-icon><Upload /></el-icon>
              <span>調整檔案限制</span>
            </div>
          </template>
          <p>修改 <code>handleFileChange</code> 方法中的檔案大小限制。</p>
          <pre><code>// 修改為 20MB
if (file.size > 20 * 1024 * 1024) {
  ElMessage.error('檔案超過 20MB')
}</code></pre>
        </el-card>

        <el-card class="tip-card">
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>自訂 API 端點</span>
            </div>
          </template>
          <p>在 <code>handleSubmit</code> 方法中修改 API URL。</p>
          <pre><code>const response = await fetch(
  '/api/v2/instructors/apply',
  { method: 'POST', body: formData }
)</code></pre>
        </el-card>

        <el-card class="tip-card">
          <template #header>
            <div class="card-header">
              <el-icon><Picture /></el-icon>
              <span>調整樣式主題</span>
            </div>
          </template>
          <p>使用 CSS 變數覆寫預設樣式。</p>
          <pre><code>.wizard-content {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
}</code></pre>
        </el-card>
      </div>
    </section>

    <!-- Testing Instructions -->
    <section class="example-section">
      <h2>測試說明</h2>
      <el-alert
        title="如何測試此組件"
        type="info"
        :closable="false"
        show-icon
      >
        <ol class="testing-steps">
          <li>確保已登入（此頁面需要身份驗證）</li>
          <li>訪問 <code>/become-instructor</code> 路徑</li>
          <li>填寫第一步的教學資料（所有欄位都是必填）</li>
          <li>點擊「下一步」進入文件上傳</li>
          <li>上傳至少 1 份證書文件（最多 5 份）</li>
          <li>點擊「下一步」檢視資料</li>
          <li>確認無誤後點擊「送出申請」</li>
          <li>查看瀏覽器控制台確認 API 請求</li>
        </ol>
      </el-alert>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InstructorApplicationWizard from './InstructorApplicationWizard.vue'
import {
  Trophy,
  Money,
  User,
  Edit,
  Upload,
  Setting,
  Picture
} from '@element-plus/icons-vue'

const wizardRef = ref(null)
</script>

<style scoped>
.example-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--capy-spacing-xxl);
  background-color: var(--capy-bg-base);
}

.example-header {
  text-align: center;
  margin-bottom: var(--capy-spacing-xxl);
}

.example-header h1 {
  font-size: 32px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.example-header p {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0;
}

.example-section {
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-xl);
  margin-bottom: var(--capy-spacing-xl);
  box-shadow: var(--capy-shadow-base);
}

.example-section h2 {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
  padding-bottom: var(--capy-spacing-sm);
  border-bottom: 2px solid var(--capy-primary);
}

.example-description {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-lg) 0;
  line-height: 1.6;
}

.example-demo {
  margin-bottom: var(--capy-spacing-lg);
}

.example-code {
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  padding: var(--capy-spacing-lg);
  border-left: 4px solid var(--capy-primary);
}

.example-code h3 {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.example-code pre {
  margin: 0;
  overflow-x: auto;
}

.example-code code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-regular);
  line-height: 1.6;
}

/* Custom Wrapper Example */
.custom-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.page-banner {
  text-align: center;
  padding: var(--capy-spacing-xxl);
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--el-color-primary-light-3) 100%);
  border-radius: var(--capy-radius-lg);
  color: white;
  margin-bottom: var(--capy-spacing-xl);
}

.page-banner h1 {
  font-size: 32px;
  font-weight: var(--capy-font-weight-bold);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.page-banner p {
  font-size: var(--capy-font-size-lg);
  margin: 0 0 var(--capy-spacing-xl) 0;
  opacity: 0.95;
}

.benefits {
  display: flex;
  justify-content: center;
  gap: var(--capy-spacing-xl);
  flex-wrap: wrap;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--capy-spacing-xs);
}

.benefit-item .el-icon {
  font-size: 32px;
}

.benefit-item span {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
}

/* Tips Grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--capy-spacing-lg);
}

.tip-card {
  border: 1px solid var(--capy-border-light);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
}

.card-header .el-icon {
  font-size: 20px;
}

.tip-card p {
  margin: 0 0 var(--capy-spacing-md) 0;
  color: var(--capy-text-regular);
  line-height: 1.6;
}

.tip-card pre {
  background-color: var(--capy-bg-base);
  padding: var(--capy-spacing-sm);
  border-radius: var(--capy-radius-sm);
  overflow-x: auto;
  margin: 0;
}

.tip-card code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-primary);
}

/* Testing Steps */
.testing-steps {
  margin: var(--capy-spacing-md) 0 0 0;
  padding-left: var(--capy-spacing-lg);
}

.testing-steps li {
  margin-bottom: var(--capy-spacing-sm);
  line-height: 1.6;
}

.testing-steps code {
  background-color: var(--capy-bg-base);
  padding: 2px 6px;
  border-radius: var(--capy-radius-xs);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--capy-font-size-sm);
  color: var(--capy-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .example-page {
    padding: var(--capy-spacing-lg);
  }

  .example-header h1 {
    font-size: 24px;
  }

  .page-banner h1 {
    font-size: 24px;
  }

  .benefits {
    gap: var(--capy-spacing-lg);
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>