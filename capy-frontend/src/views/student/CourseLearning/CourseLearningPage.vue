<template>
  <div class="course-learning-page" v-loading="pageLoading">
    <!-- 主要內容區：左側（影片 + Tabs）+ 右側（側邊欄） -->
    <div class="main-content-wrapper">
      <!-- 左側：影片播放器 + Tabs 內容區 -->
      <div class="video-and-tabs-section">
        <!-- 影片播放器 -->
        <div class="video-section">
          <VideoPlayerShaka
            v-if="currentLesson"
            :video-url="currentLesson.videoUrl"
            :poster="currentLesson.poster"
            :autoplay="false"
            :start-time="0"
            @timeupdate="handleTimeUpdate"
            @ended="handleVideoEnded"
            @error="handleVideoError"
          />
        </div>

        <!-- Tabs 內容區 -->
        <div class="content-section">
          <div class="tabs-container">
            <el-tabs v-model="activeTab" class="content-tabs">
              <!-- Tab 1: 章節詳情 -->
              <el-tab-pane label="章節詳情" name="details">
                <div class="tab-content">
                  <div v-if="currentLesson?.description" class="lesson-description">
                    <h3 class="section-title-student">{{ currentLesson.title }}</h3>
                    <div class="description-content" v-html="sanitizeHtml(currentLesson.description)"></div>
                  </div>
                  <el-empty v-else description="本單元暫無詳細說明" :image-size="100" />
                </div>
              </el-tab-pane>

              <!-- Tab 2: 附件下載 -->
              <el-tab-pane label="附件下載" name="attachments">
                <div class="tab-content">
                  <el-table
                    v-if="currentLesson?.attachments?.length > 0"
                    :data="currentLesson.attachments"
                    stripe
                    style="width: 100%"
                  >
                    <el-table-column prop="name" label="檔案名稱" min-width="200">
                      <template #default="{ row }">
                        <div class="file-name">
                          <el-icon><Document /></el-icon>
                          <span>{{ row.name }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="類型" width="100">
                      <template #default="{ row }">
                        <el-tag :type="getFileTagType(row.type)" size="small">
                          {{ row.type.toUpperCase() }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="size" label="大小" width="120" />
                    <el-table-column label="操作" width="120" align="center">
                      <template #default="{ row }">
                        <el-button
                          type="primary"
                          size="small"
                          :icon="Download"
                          @click="handleDownload(row)"
                        >
                          下載
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-empty v-else description="本單元無附件" :image-size="100" />
                </div>
              </el-tab-pane>

              <!-- Tab 3: FAQ -->
              <el-tab-pane label="常見問題" name="faq">
                <div class="tab-content faq-content">
                  <FaqFilterBar
                    :chapters="courseData.chapters"
                    @filter-change="handleFaqFilter"
                  />
                  <FaqList
                    :faqs="filteredFaqs"
                    :loading="faqLoading"
                    :chapters="courseData.chapters"
                    :enable-markdown="false"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <!-- 右側：章節側邊欄 -->
      <div class="sidebar-container">
        <ChaptersSidebar
          :chapters="courseData.chapters"
          :current-lesson-id="currentLessonId"
          @lesson-click="handleLessonClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Document, Download } from '@element-plus/icons-vue'
import DOMPurify from 'dompurify'

import VideoPlayerShaka from '@/components/student/CoursePlay/VideoPlayerShaka.vue'
import ChaptersSidebar from '@/components/student/CoursePlay/ChaptersSidebar.vue'
import FaqFilterBar from '@/components/student/CoursePlay/FaqFilterBar.vue'
import FaqList from '@/components/student/CoursePlay/FaqList.vue'

// 導入假資料
import { getCourseData, getFaqData } from '@/mockData'

const route = useRoute()
const router = useRouter()

// 狀態管理
const pageLoading = ref(true)
const faqLoading = ref(false)
const activeTab = ref('details')

// 課程資料
const courseData = ref({
  courseId: '',
  courseTitle: '',
  chapters: []
})

// FAQ 資料
const allFaqs = ref([])
const faqFilter = ref({
  keyword: '',
  chapterId: '',
  lessonId: ''
})

// 當前單元 ID
const currentLessonId = computed(() => route.params.lessonId)

/**
 * 取得當前播放的單元
 */
const currentLesson = computed(() => {
  for (const chapter of courseData.value.chapters) {
    const lesson = chapter.lessons.find(l => l.id === currentLessonId.value)
    if (lesson) {
      return lesson
    }
  }
  return null
})

/**
 * 篩選後的 FAQ 列表
 */
const filteredFaqs = computed(() => {
  let result = allFaqs.value

  // 關鍵字篩選
  if (faqFilter.value.keyword) {
    const keyword = faqFilter.value.keyword.toLowerCase()
    result = result.filter(faq =>
      faq.question.toLowerCase().includes(keyword) ||
      faq.answer.toLowerCase().includes(keyword) ||
      faq.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  // 章節篩選
  if (faqFilter.value.chapterId) {
    result = result.filter(faq => faq.chapterId === faqFilter.value.chapterId)
  }

  // 單元篩選
  if (faqFilter.value.lessonId) {
    result = result.filter(faq => faq.lessonId === faqFilter.value.lessonId)
  }

  return result
})

/**
 * 載入課程資料
 */
const loadCourseData = async () => {
  try {
    pageLoading.value = true

    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 500))

    const courseId = route.params.courseId
    const data = getCourseData(courseId)

    if (!data) {
      throw new Error('課程不存在')
    }

    courseData.value = data

    // 更新路由 meta 以顯示課程標題
    route.meta.courseTitle = data.courseTitle

    // 檢查當前單元是否存在
    if (!currentLesson.value) {
      ElMessage.error('單元不存在')
      router.push('/')
      return
    }

  } catch (error) {
    console.error('載入課程資料失敗:', error)
    ElMessage.error(error.message || '載入課程資料失敗')
    router.push('/')
  } finally {
    pageLoading.value = false
  }
}

/**
 * 載入 FAQ 資料
 */
const loadFaqData = async () => {
  try {
    faqLoading.value = true

    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 300))

    const courseId = route.params.courseId
    allFaqs.value = getFaqData(courseId)

  } catch (error) {
    console.error('載入 FAQ 失敗:', error)
    ElMessage.error('載入常見問題失敗')
  } finally {
    faqLoading.value = false
  }
}

/**
 * 處理單元點擊
 * @param {Object} lesson - 單元物件
 */
const handleLessonClick = (lesson) => {
  if (lesson.id === currentLessonId.value) {
    return
  }

  // 導航到新單元
  router.push({
    name: 'CourseLearning',
    params: {
      courseId: route.params.courseId,
      lessonId: lesson.id
    }
  })
}

/**
 * 處理影片時間更新
 * @param {Object} data - { currentTime, duration }
 */
const handleTimeUpdate = (data) => {
  // 可以在這裡記錄學習進度
  // console.log('播放進度:', data)
}

/**
 * 處理影片播放結束
 */
const handleVideoEnded = () => {
  // 標記當前單元為已完成
  if (currentLesson.value) {
    currentLesson.value.isCompleted = true
  }

  // 自動跳轉到下一單元
  const nextLesson = getNextLesson()
  if (nextLesson) {
    ElMessage.success('已完成本單元，即將播放下一單元')
    setTimeout(() => {
      handleLessonClick(nextLesson)
    }, 2000)
  } else {
    ElMessage.success('恭喜！您已完成本課程所有單元')
  }
}

/**
 * 處理影片錯誤
 * @param {string} error - 錯誤訊息
 */
const handleVideoError = (error) => {
  ElMessage.error(error || '影片播放發生錯誤')
}

/**
 * 取得下一個單元
 * @returns {Object|null} 下一個單元物件
 */
const getNextLesson = () => {
  let foundCurrent = false

  for (const chapter of courseData.value.chapters) {
    for (const lesson of chapter.lessons) {
      if (foundCurrent && !lesson.isLocked) {
        return lesson
      }
      if (lesson.id === currentLessonId.value) {
        foundCurrent = true
      }
    }
  }

  return null
}

/**
 * 處理 FAQ 篩選
 * @param {Object} filter - 篩選條件
 */
const handleFaqFilter = (filter) => {
  faqFilter.value = filter
}

/**
 * 處理附件下載
 * @param {Object} attachment - 附件物件
 */
const handleDownload = (attachment) => {
  // 實際專案中應該呼叫下載 API
  ElMessage.success(`開始下載：${attachment.name}`)

  // 模擬下載
  const link = document.createElement('a')
  link.href = attachment.url
  link.download = attachment.name
  link.click()
}

/**
 * 取得檔案類型標籤樣式
 * @param {string} type - 檔案類型
 * @returns {string} Element Plus tag type
 */
const getFileTagType = (type) => {
  const typeMap = {
    'pdf': 'danger',
    'doc': 'primary',
    'docx': 'primary',
    'ppt': 'warning',
    'pptx': 'warning',
    'zip': 'info',
    'rar': 'info'
  }
  return typeMap[type.toLowerCase()] || 'info'
}

/**
 * 清理 HTML（防止 XSS）
 * @param {string} html - 原始 HTML
 * @returns {string} 清理後的 HTML
 */
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}

/**
 * 監聽路由參數變化
 */
watch(() => route.params.lessonId, (newLessonId) => {
  if (newLessonId && !pageLoading.value) {
    // 單元切換時，重置 tab 到詳情頁
    activeTab.value = 'details'
  }
})

// 生命週期
onMounted(async () => {
  await loadCourseData()
  await loadFaqData()
})
</script>

<style scoped lang="scss">
.course-learning-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

// 主要內容包裝器：左側（影片+Tabs）+ 右側（側邊欄）
.main-content-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  gap: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// 左側：影片 + Tabs 區域
.video-and-tabs-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; // 防止 flex 子元素溢出
  background-color: #f5f5f5;
}

.video-section {
  width: 100%;
  background-color: #000;

  // 確保影片容器保持 16:9 比例
  :deep(.video-player-container) {
    width: 100%;
  }
}

// 右側：側邊欄
.sidebar-container {
  width: 400px;
  min-width: 400px;
  max-width: 400px;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 1px solid #DCDFE6;

  // 確保 ChaptersSidebar 填滿容器
  :deep(.chapters-sidebar) {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  @media (max-width: 1199px) {
    width: 350px;
    min-width: 350px;
    max-width: 350px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: 400px;
    border-left: none;
    border-top: 1px solid #DCDFE6;
  }
}

// Tabs 內容區
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 400px;
  overflow: hidden;
}

.tabs-container {
  flex: 1;
  background-color: #ffffff;
  overflow: hidden;

  .content-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 24px;
      background-color: #fafafa;
      border-bottom: 1px solid #DCDFE6;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: auto;
      padding: 0;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }
  }

  .tab-content {
    padding: 24px;
    height: 100%;
    overflow-y: auto;

    &.faq-content {
      padding: 16px;
    }
  }

  .lesson-description {
    .section-title-student {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #DCDFE6;
    }

    .description-content {
      font-size: 15px;
      line-height: 1.8;
      color: #606266;

      :deep(p) {
        margin: 12px 0;
      }

      :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
        margin: 16px 0 8px;
        font-weight: 600;
        color: #303133;
      }

      :deep(ul), :deep(ol) {
        padding-left: 24px;
        margin: 12px 0;
      }

      :deep(li) {
        margin: 6px 0;
      }

      :deep(a) {
        color: #409EFF;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .file-name {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-icon {
      font-size: 18px;
      color: #909399;
    }
  }
}

// 響應式設計
@media (max-width: 768px) {
  .tabs-container {
    .tab-content {
      padding: 16px;
    }

    .lesson-description {
      .section-title-student {
        font-size: 18px;
      }

      .description-content {
        font-size: 14px;
      }
    }
  }
}
</style>
