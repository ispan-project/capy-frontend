<template>
  <InfoPageLayout>
    <!-- Hero 區塊 -->
    <div class="hero-section">
      <h1 class="hero-title">👋 我們能如何協助您？</h1>
      <p class="hero-subtitle">搜尋常見問題或瀏覽下方分類</p>

      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="輸入關鍵字搜尋問題..."
          size="large"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 搜尋結果 -->
      <div v-if="searchQuery && filteredFaqs.length > 0" class="search-results">
        <p class="results-count">找到 {{ filteredFaqs.length }} 個相關問題</p>
      </div>
    </div>

    <!-- FAQ 區塊 -->
    <div class="faq-section">
      <h2 class="section-title-student">常見問題</h2>

      <!-- 學生問題 -->
      <div class="faq-category">
        <h3 class="category-title">
          <el-icon><User /></el-icon>
          學生常見問題
        </h3>
        <el-collapse v-model="activeStudentFaq" accordion>
          <el-collapse-item
            v-for="faq in displayedStudentFaqs"
            :key="faq.id"
            :name="faq.id"
          >
            <template #title>
              <span class="faq-question">{{ faq.question }}</span>
            </template>
            <div class="faq-answer" v-html="faq.answer"></div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 講師問題 -->
      <div class="faq-category">
        <h3 class="category-title">
          <el-icon><Reading /></el-icon>
          講師常見問題
        </h3>
        <el-collapse v-model="activeInstructorFaq" accordion>
          <el-collapse-item
            v-for="faq in displayedInstructorFaqs"
            :key="faq.id"
            :name="faq.id"
          >
            <template #title>
              <span class="faq-question">{{ faq.question }}</span>
            </template>
            <div class="faq-answer" v-html="faq.answer"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- 聯絡客服區塊 -->
    <div class="contact-section">
      <div class="contact-card">
        <el-icon class="contact-icon"><Service /></el-icon>
        <h3 class="contact-title">找不到答案？</h3>
        <p class="contact-description">
          我們的客服團隊隨時準備協助您解決問題
        </p>
        <div class="contact-methods">
          <a href="mailto:support@capycourse.com" class="contact-button">
            <el-icon><Message /></el-icon>
            <span>發送電子郵件</span>
          </a>
          <p class="contact-info">
            客服時間：週一至週五 09:00-18:00（台灣時間）
          </p>
        </div>
      </div>
    </div>
  </InfoPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InfoPageLayout from '@/layouts/InfoPageLayout.vue'
import { Search, User, Reading, Service, Message } from '@element-plus/icons-vue'

const searchQuery = ref('')
const activeStudentFaq = ref('')
const activeInstructorFaq = ref('')

// 學生 FAQ 資料
const studentFaqs = ref([
  {
    id: 's1',
    question: '如何購買課程？',
    answer: `
      <p>購買課程非常簡單：</p>
      <ol>
        <li>瀏覽課程頁面，點擊「加入購物車」</li>
        <li>前往購物車確認課程清單</li>
        <li>點擊「結帳」並選擇付款方式</li>
        <li>完成付款後即可立即開始學習</li>
      </ol>
      <p>購買後的課程將永久保存在「我的學習」中。</p>
    `
  },
  {
    id: 's2',
    question: '可以退款嗎？',
    answer: `
      <p><strong>CapyCourse 不提供自動退款服務。</strong></p>
      <p>根據消費者保護法，數位商品一經解鎖觀看，即不適用7日鑑賞期。</p>
      <p>購買前請務必：</p>
      <ul>
        <li>觀看「免費試看」課程內容</li>
        <li>詳閱課程大綱與學員評價</li>
        <li>確認課程符合您的需求</li>
      </ul>
      <p>特殊情況（如重複扣款、技術問題）可聯絡客服申請人工審核。詳見<a href="/legal/refund">退款政策</a>。</p>
    `
  },
  {
    id: 's3',
    question: '課程可以永久觀看嗎？',
    answer: `
      <p>是的！購買課程後，您將獲得<strong>永久觀看權限</strong>。</p>
      <p>您可以：</p>
      <ul>
        <li>隨時隨地重複觀看課程內容</li>
        <li>依照自己的步調學習</li>
        <li>下載課程提供的教材與附件</li>
      </ul>
      <p>唯一例外：若課程因違規被平台下架，或講師主動移除課程。</p>
    `
  },
  {
    id: 's4',
    question: '如何追蹤學習進度？',
    answer: `
      <p>系統會自動記錄您的學習進度：</p>
      <ul>
        <li>已觀看的章節會標示為「已完成」</li>
        <li>在「我的學習」頁面可查看整體進度百分比</li>
        <li>課程卡片會顯示上次觀看的位置</li>
      </ul>
      <p>您也可以手動標記章節為已完成或未完成。</p>
    `
  },
  {
    id: 's5',
    question: '可以在手機上觀看課程嗎？',
    answer: `
      <p>當然可以！CapyCourse 支援響應式設計，您可以在以下裝置上觀看：</p>
      <ul>
        <li>桌上型電腦（Windows、Mac）</li>
        <li>筆記型電腦</li>
        <li>平板電腦（iPad、Android 平板）</li>
        <li>智慧型手機（iOS、Android）</li>
      </ul>
      <p>建議使用最新版本的 Chrome、Safari、Firefox 或 Edge 瀏覽器以獲得最佳體驗。</p>
    `
  },
  {
    id: 's6',
    question: '如何聯絡講師？',
    answer: `
      <p>目前平台提供以下方式與講師互動：</p>
      <ul>
        <li><strong>課程問答區</strong>：在課程頁面提問，講師會回覆</li>
        <li><strong>課程評價</strong>：完成課程後可留下評價與建議</li>
      </ul>
      <p>若有緊急問題，也可以透過客服團隊轉達給講師。</p>
    `
  }
])

// 講師 FAQ 資料
const instructorFaqs = ref([
  {
    id: 'i1',
    question: '如何成為 CapyCourse 講師？',
    answer: `
      <p>成為講師的步驟：</p>
      <ol>
        <li>點擊「成為講師」按鈕</li>
        <li>填寫申請表單（包括專業背景、教學經驗等）</li>
        <li>提供銀行帳戶資訊（用於收益撥款）</li>
        <li>等待平台審核（通常 3-5 個工作天）</li>
        <li>審核通過後即可開始上傳課程</li>
      </ol>
      <p>我們歡迎各領域的專業人士加入！</p>
    `
  },
  {
    id: 'i2',
    question: '講師可以獲得多少收益？',
    answer: `
      <p>CapyCourse 採用<strong>收益分潤制度</strong>：</p>
      <ul>
        <li>講師可獲得課程銷售額的 <strong>70%</strong></li>
        <li>平台保留 30% 用於營運、行銷與技術維護</li>
      </ul>
      <p>收益計算範例：</p>
      <ul>
        <li>課程售價 $1,000，講師可獲得 $700</li>
        <li>課程售價 $2,500，講師可獲得 $1,750</li>
      </ul>
      <p>收益每月結算一次，並於次月 15 日前撥款至您的銀行帳戶。</p>
    `
  },
  {
    id: 'i3',
    question: '課程影片有什麼規格要求？',
    answer: `
      <p>為確保學員獲得最佳學習體驗，我們建議：</p>
      <ul>
        <li><strong>解析度</strong>：至少 1080p (1920x1080)</li>
        <li><strong>格式</strong>：MP4、MOV、AVI</li>
        <li><strong>音質</strong>：清晰無雜音，建議使用外接麥克風</li>
        <li><strong>檔案大小</strong>：單一影片不超過 2GB</li>
        <li><strong>長度</strong>：建議每個章節 5-20 分鐘</li>
      </ul>
      <p>影片上傳後，系統會自動轉檔並產生多種畫質供學員選擇。</p>
    `
  },
  {
    id: 'i4',
    question: '如何定價課程？',
    answer: `
      <p>課程定價由講師自行決定，但建議考慮以下因素：</p>
      <ul>
        <li><strong>課程時長</strong>：內容越豐富，價格可以越高</li>
        <li><strong>專業程度</strong>：進階課程通常定價較高</li>
        <li><strong>市場行情</strong>：參考同類型課程的價格</li>
        <li><strong>目標受眾</strong>：考慮學員的付費能力</li>
      </ul>
      <p>建議價格範圍：$500 - $5,000</p>
      <p>您可以隨時調整課程價格，但建議不要頻繁變動。</p>
    `
  },
  {
    id: 'i5',
    question: '課程審核需要多久？',
    answer: `
      <p>課程審核流程：</p>
      <ol>
        <li>講師提交課程後，系統會進行初步檢查</li>
        <li>平台團隊會審核課程內容、品質與合規性</li>
        <li>審核時間通常為 <strong>3-5 個工作天</strong></li>
        <li>審核通過後，課程將立即上架</li>
      </ol>
      <p>若課程需要修改，我們會透過電子郵件通知您具體原因。</p>
    `
  },
  {
    id: 'i6',
    question: '可以下架或刪除課程嗎？',
    answer: `
      <p>是的，您可以隨時下架或刪除課程：</p>
      <ul>
        <li><strong>下架</strong>：課程不再對新學員開放，但已購買的學員仍可觀看</li>
        <li><strong>刪除</strong>：完全移除課程，已購買的學員將失去存取權限（需退款）</li>
      </ul>
      <p><strong>重要提醒</strong>：刪除課程前，請先聯絡客服處理退款事宜。</p>
    `
  }
])

// 搜尋功能
const handleSearch = () => {
  // 搜尋邏輯已在 computed 中處理
}

// 過濾後的 FAQ
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  const allFaqs = [...studentFaqs.value, ...instructorFaqs.value]

  return allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  )
})

// 顯示的學生 FAQ
const displayedStudentFaqs = computed(() => {
  if (!searchQuery.value) return studentFaqs.value

  return studentFaqs.value.filter(faq =>
    filteredFaqs.value.some(filtered => filtered.id === faq.id)
  )
})

// 顯示的講師 FAQ
const displayedInstructorFaqs = computed(() => {
  if (!searchQuery.value) return instructorFaqs.value

  return instructorFaqs.value.filter(faq =>
    filteredFaqs.value.some(filtered => filtered.id === faq.id)
  )
})
</script>

<style scoped>
/* Hero 區塊 */
.hero-section {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--capy-bg-base);
}

.hero-title {
  font-size: 36px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 12px 0;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--capy-text-regular);
  margin: 0 0 32px 0;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: var(--capy-radius-round);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
}

.search-box :deep(.el-input__inner) {
  font-size: 16px;
}

.search-results {
  margin-top: 16px;
}

.results-count {
  color: var(--capy-text-regular);
  font-size: 14px;
}

/* FAQ 區塊 */
.faq-section {
  margin-bottom: 48px;
}

.section-title-student {
  font-size: 28px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 32px 0;
}

.faq-category {
  margin-bottom: 40px;
}

.faq-category:last-child {
  margin-bottom: 0;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--capy-primary-dark);
  margin: 0 0 20px 0;
}

.category-title .el-icon {
  font-size: 24px;
}

.faq-question {
  font-size: 16px;
  font-weight: 500;
  color: var(--capy-text-primary);
}

.faq-answer {
  color: var(--capy-text-regular);
  line-height: 1.8;
  padding: 16px 0;
}

.faq-answer :deep(p) {
  margin: 0 0 12px 0;
}

.faq-answer :deep(ul),
.faq-answer :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.faq-answer :deep(li) {
  margin-bottom: 8px;
}

.faq-answer :deep(strong) {
  color: var(--capy-text-primary);
  font-weight: 600;
}

.faq-answer :deep(a) {
  color: var(--capy-primary);
  text-decoration: none;
}

.faq-answer :deep(a:hover) {
  color: var(--capy-primary-dark);
  text-decoration: underline;
}

/* 聯絡客服區塊 */
.contact-section {
  margin-top: 48px;
}

.contact-card {
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-primary-dark) 100%);
  border-radius: var(--capy-radius-lg);
  padding: 48px;
  text-align: center;
  color: white;
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.contact-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.contact-description {
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.9;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background-color: white;
  color: var(--capy-primary);
  border-radius: var(--capy-radius-round);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.contact-info {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-title-student {
    font-size: 24px;
  }

  .category-title {
    font-size: 18px;
  }

  .contact-card {
    padding: 32px 24px;
  }

  .contact-title {
    font-size: 20px;
  }
}
</style>
