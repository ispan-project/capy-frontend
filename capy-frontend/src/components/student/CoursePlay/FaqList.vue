<template>
  <div class="faq-list">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 無結果狀態 -->
    <el-empty
      v-else-if="!loading && faqs.length === 0"
      description="目前沒有相關的常見問題"
      :image-size="120"
    >
      <template #image>
        <el-icon :size="80" color="#C0C4CC">
          <QuestionFilled />
        </el-icon>
      </template>
    </el-empty>

    <!-- FAQ 列表 -->
    <div v-else class="faq-content">
      <!-- 結果數量提示 -->
      <div class="result-count">
        <el-icon><InfoFilled /></el-icon>
        <span>找到 <strong>{{ faqs.length }}</strong> 個相關問題</span>
      </div>

      <!-- 手風琴式問答列表 -->
      <el-collapse v-model="activeNames" accordion class="faq-collapse">
        <el-collapse-item
          v-for="faq in faqs"
          :key="faq.id"
          :name="faq.id"
          class="faq-item"
        >
          <!-- 問題標題 -->
          <template #title>
            <div class="faq-question">
              <el-icon class="question-icon">
                <QuestionFilled />
              </el-icon>
              <span class="question-text">{{ faq.question }}</span>
              
              <!-- 標籤 -->
              <div class="question-tags">
                <el-tag
                  v-for="tag in faq.tags"
                  :key="tag"
                  :type="getTagType(tag)"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </template>

          <!-- 答案內容 -->
          <div class="faq-answer">
            <div class="answer-header">
              <el-icon class="answer-icon">
                <ChatDotRound />
              </el-icon>
              <span class="answer-label">回答</span>
            </div>
            
            <!-- 支援 Markdown 或純文字 -->
            <div
              v-if="enableMarkdown"
              class="answer-content markdown-body"
              v-html="renderMarkdown(faq.answer)"
            ></div>
            <div v-else class="answer-content" v-html="sanitizeHtml(faq.answer)"></div>

            <!-- 相關資訊 -->
            <div class="answer-meta">
              <el-tag size="small" type="info">
                <el-icon><Folder /></el-icon>
                {{ getChapterTitle(faq.chapterId) }}
              </el-tag>
              <el-tag size="small" type="info">
                <el-icon><VideoPlay /></el-icon>
                {{ getLessonTitle(faq.lessonId) }}
              </el-tag>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  QuestionFilled,
  InfoFilled,
  ChatDotRound,
  Folder,
  VideoPlay
} from '@element-plus/icons-vue'
import DOMPurify from 'dompurify'

/**
 * Props 定義
 * @property {Array} faqs - FAQ 列表
 * @property {boolean} loading - 載入狀態
 * @property {Array} chapters - 章節列表（用於顯示相關資訊）
 * @property {boolean} enableMarkdown - 是否啟用 Markdown 渲染
 */
const props = defineProps({
  faqs: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  chapters: {
    type: Array,
    default: () => []
  },
  enableMarkdown: {
    type: Boolean,
    default: false
  }
})

// 當前展開的 FAQ
const activeNames = ref([])

/**
 * 根據標籤內容返回對應的 Element Plus tag type
 * @param {string} tag - 標籤文字
 * @returns {string} tag type
 */
const getTagType = (tag) => {
  const tagMap = {
    '安裝': 'success',
    '環境設定': 'success',
    '語法': 'primary',
    '概念': 'primary',
    '錯誤': 'danger',
    '除錯': 'danger',
    '效能': 'warning',
    '最佳實踐': 'warning'
  }
  return tagMap[tag] || 'info'
}

/**
 * 取得章節標題
 * @param {string} chapterId - 章節 ID
 * @returns {string} 章節標題
 */
const getChapterTitle = (chapterId) => {
  const chapter = props.chapters.find(c => c.id === chapterId)
  return chapter ? chapter.title : '未知章節'
}

/**
 * 取得單元標題
 * @param {string} lessonId - 單元 ID
 * @returns {string} 單元標題
 */
const getLessonTitle = (lessonId) => {
  for (const chapter of props.chapters) {
    const lesson = chapter.lessons?.find(l => l.id === lessonId)
    if (lesson) {
      return lesson.title
    }
  }
  return '未知單元'
}

/**
 * 清理 HTML（防止 XSS 攻擊）
 * @param {string} html - 原始 HTML
 * @returns {string} 清理後的 HTML
 */
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}

/**
 * 渲染 Markdown（簡易版本，實際專案建議使用 marked 或 markdown-it）
 * @param {string} markdown - Markdown 文字
 * @returns {string} HTML
 */
const renderMarkdown = (markdown) => {
  if (!markdown) return ''
  
  // 這裡使用簡易的 Markdown 轉換
  // 實際專案應該使用 marked 或 markdown-it 等專業函式庫
  let html = markdown
    // 標題
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗體
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // 斜體
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // 程式碼區塊
    .replace(/```(.*?)```/gims, '<pre><code>$1</code></pre>')
    // 行內程式碼
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    // 連結
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // 換行
    .replace(/\n/gim, '<br>')

  return sanitizeHtml(html)
}
</script>

<style scoped lang="scss">
.faq-list {
  width: 100%;
}

.loading-container {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
}

.faq-content {
  .result-count {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: #f0f9ff;
    border-left: 3px solid #409EFF;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #606266;

    .el-icon {
      color: #409EFF;
      font-size: 16px;
    }

    strong {
      color: #409EFF;
      font-weight: 600;
    }
  }
}

.faq-collapse {
  border: none;

  .faq-item {
    margin-bottom: 16px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    :deep(.el-collapse-item__header) {
      padding: 16px 20px;
      background-color: #fafafa;
      border: none;
      font-size: 15px;
      font-weight: 500;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f0f0f0;
      }

      &.is-active {
        background-color: #ecf5ff;
        border-bottom: 1px solid #DCDFE6;
      }
    }

    :deep(.el-collapse-item__content) {
      padding: 0;
      border: none;
    }

    :deep(.el-collapse-item__wrap) {
      border: none;
    }
  }
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding-right: 40px;

  .question-icon {
    flex-shrink: 0;
    font-size: 20px;
    color: #409EFF;
  }

  .question-text {
    flex: 1;
    color: #303133;
    line-height: 1.5;
  }

  .question-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
}

.faq-answer {
  padding: 20px;
  background-color: #ffffff;

  .answer-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;

    .answer-icon {
      font-size: 18px;
      color: #67C23A;
    }

    .answer-label {
      font-size: 14px;
      font-weight: 600;
      color: #606266;
    }
  }

  .answer-content {
    font-size: 14px;
    line-height: 1.8;
    color: #606266;
    margin-bottom: 16px;

    :deep(p) {
      margin: 8px 0;
    }

    :deep(code) {
      padding: 2px 6px;
      background-color: #f5f7fa;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #e83e8c;
    }

    :deep(pre) {
      padding: 12px;
      background-color: #282c34;
      border-radius: 4px;
      overflow-x: auto;
      margin: 12px 0;

      code {
        color: #abb2bf;
        background: none;
        padding: 0;
      }
    }

    :deep(a) {
      color: #409EFF;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(strong) {
      font-weight: 600;
      color: #303133;
    }

    :deep(ul), :deep(ol) {
      padding-left: 24px;
      margin: 8px 0;
    }

    :deep(li) {
      margin: 4px 0;
    }
  }

  .answer-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .el-tag {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-icon {
        font-size: 14px;
      }
    }
  }
}

// Markdown 樣式（如果啟用）
.markdown-body {
  :deep(h1), :deep(h2), :deep(h3) {
    margin: 16px 0 8px;
    font-weight: 600;
    color: #303133;
  }

  :deep(h1) {
    font-size: 20px;
  }

  :deep(h2) {
    font-size: 18px;
  }

  :deep(h3) {
    font-size: 16px;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .faq-question {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-right: 30px;

    .question-tags {
      width: 100%;
    }
  }

  .faq-answer {
    padding: 16px;

    .answer-content {
      font-size: 13px;
    }
  }

  .result-count {
    font-size: 13px;
  }
}
</style>