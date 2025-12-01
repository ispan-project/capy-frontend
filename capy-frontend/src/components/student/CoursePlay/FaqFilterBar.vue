<template>
  <div class="faq-filter-bar">
    <el-form
      :model="filterForm"
      :inline="!isMobile"
      class="filter-form"
      label-position="top"
    >
      <!-- 關鍵字搜尋 -->
      <el-form-item label="搜尋關鍵字" class="filter-item search-item">
        <el-input
          v-model="filterForm.keyword"
          placeholder="輸入問題關鍵字..."
          :prefix-icon="Search"
          clearable
          @input="handleFilterChange"
          class="search-input"
        />
      </el-form-item>

      <!-- 章節選擇 -->
      <el-form-item label="選擇章節" class="filter-item">
        <el-select
          v-model="filterForm.chapterId"
          placeholder="全部章節"
          clearable
          @change="handleChapterChange"
          class="filter-select"
        >
          <el-option
            v-for="chapter in chapters"
            :key="chapter.id"
            :label="chapter.title"
            :value="chapter.id"
          />
        </el-select>
      </el-form-item>

      <!-- 單元選擇 -->
      <el-form-item label="選擇單元" class="filter-item">
        <el-select
          v-model="filterForm.lessonId"
          placeholder="全部單元"
          clearable
          :disabled="!filterForm.chapterId"
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="lesson in availableLessons"
            :key="lesson.id"
            :label="lesson.title"
            :value="lesson.id"
          />
        </el-select>
      </el-form-item>

      <!-- 重置按鈕 -->
      <el-form-item label=" " class="filter-item reset-item">
        <el-button
          :icon="RefreshLeft"
          @click="handleReset"
          class="reset-btn"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 篩選結果提示 -->
    <div v-if="hasActiveFilters" class="filter-summary">
      <el-tag
        v-if="filterForm.keyword"
        closable
        @close="clearKeyword"
        type="info"
      >
        關鍵字: {{ filterForm.keyword }}
      </el-tag>
      <el-tag
        v-if="filterForm.chapterId"
        closable
        @close="clearChapter"
        type="info"
      >
        章節: {{ getChapterTitle(filterForm.chapterId) }}
      </el-tag>
      <el-tag
        v-if="filterForm.lessonId"
        closable
        @close="clearLesson"
        type="info"
      >
        單元: {{ getLessonTitle(filterForm.lessonId) }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'

/**
 * Props 定義
 * @property {Array} chapters - 章節列表（用於下拉選單）
 */
const props = defineProps({
  chapters: {
    type: Array,
    required: true,
    default: () => []
  }
})

/**
 * Emits 定義
 * @event filter-change - 篩選條件變更 { keyword, chapterId, lessonId }
 */
const emit = defineEmits(['filter-change'])

// 篩選表單
const filterForm = ref({
  keyword: '',
  chapterId: '',
  lessonId: ''
})

// 防抖計時器
let debounceTimer = null

// 響應式視窗尺寸
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

/**
 * 根據選擇的章節取得可用的單元列表
 */
const availableLessons = computed(() => {
  if (!filterForm.value.chapterId) {
    return []
  }

  const selectedChapter = props.chapters.find(
    chapter => chapter.id === filterForm.value.chapterId
  )

  return selectedChapter ? selectedChapter.lessons : []
})

/**
 * 檢查是否有啟用的篩選條件
 */
const hasActiveFilters = computed(() => {
  return !!(
    filterForm.value.keyword ||
    filterForm.value.chapterId ||
    filterForm.value.lessonId
  )
})

/**
 * 處理篩選條件變更（帶防抖）
 */
const handleFilterChange = () => {
  // 清除之前的計時器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 設定新的計時器（300ms 防抖）
  debounceTimer = setTimeout(() => {
    emitFilterChange()
  }, 300)
}

/**
 * 處理章節變更
 */
const handleChapterChange = () => {
  // 章節變更時清空單元選擇
  filterForm.value.lessonId = ''
  handleFilterChange()
}

/**
 * 發送篩選變更事件
 */
const emitFilterChange = () => {
  emit('filter-change', {
    keyword: filterForm.value.keyword.trim(),
    chapterId: filterForm.value.chapterId,
    lessonId: filterForm.value.lessonId
  })
}

/**
 * 重置所有篩選條件
 */
const handleReset = () => {
  filterForm.value = {
    keyword: '',
    chapterId: '',
    lessonId: ''
  }
  emitFilterChange()
}

/**
 * 清除關鍵字
 */
const clearKeyword = () => {
  filterForm.value.keyword = ''
  handleFilterChange()
}

/**
 * 清除章節選擇
 */
const clearChapter = () => {
  filterForm.value.chapterId = ''
  filterForm.value.lessonId = ''
  handleFilterChange()
}

/**
 * 清除單元選擇
 */
const clearLesson = () => {
  filterForm.value.lessonId = ''
  handleFilterChange()
}

/**
 * 取得章節標題
 * @param {string} chapterId - 章節 ID
 * @returns {string} 章節標題
 */
const getChapterTitle = (chapterId) => {
  const chapter = props.chapters.find(c => c.id === chapterId)
  return chapter ? chapter.title : ''
}

/**
 * 取得單元標題
 * @param {string} lessonId - 單元 ID
 * @returns {string} 單元標題
 */
const getLessonTitle = (lessonId) => {
  for (const chapter of props.chapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId)
    if (lesson) {
      return lesson.title
    }
  }
  return ''
}

/**
 * 監聽章節列表變化，重置篩選
 */
watch(() => props.chapters, () => {
  // 如果章節列表變化，檢查當前選擇是否仍然有效
  if (filterForm.value.chapterId) {
    const chapterExists = props.chapters.some(
      c => c.id === filterForm.value.chapterId
    )
    if (!chapterExists) {
      handleReset()
    }
  }
})
</script>

<style scoped lang="scss">
.faq-filter-bar {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .filter-item {
    flex: 0 0 auto;

    &.search-item {
      flex: 1;
      min-width: 200px;

      .search-input {
        width: 100%;
      }
    }

    .filter-select {
      width: 200px;
    }

    &.reset-item {
      .reset-btn {
        width: 100%;
      }
    }
  }
}

.filter-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;

  .el-tag {
    font-size: 13px;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .faq-filter-bar {
    padding: 16px;
  }

  .filter-form {
    flex-direction: column;
    gap: 0;

    .filter-item {
      width: 100%;
      margin-bottom: 16px;

      &.search-item {
        min-width: 100%;
      }

      .filter-select {
        width: 100%;
      }
    }

    :deep(.el-form-item__label) {
      padding-bottom: 4px;
    }
  }

  .filter-summary {
    margin-top: 12px;
    padding-top: 12px;
  }
}

// Element Plus 樣式覆寫
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #DCDFE6 inset;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 0 1px #C0C4CC inset;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px #409EFF inset;
  }
}

:deep(.el-select) {
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #DCDFE6 inset;
  }

  &:hover .el-input__wrapper {
    box-shadow: 0 0 0 1px #C0C4CC inset;
  }

  &.is-focus .el-input__wrapper {
    box-shadow: 0 0 0 1px #409EFF inset;
  }
}
</style>