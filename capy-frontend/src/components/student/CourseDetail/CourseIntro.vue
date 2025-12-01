<template>
  <div class="course-intro">
    <h2 class="intro-title">課程介紹</h2>
    <p class="course-description">{{ description }}</p>
    
    <!-- 試看單元 -->
    <div v-if="previewLesson" class="preview-section">
      <div class="preview-header">
        <el-icon class="preview-icon"><VideoPlay /></el-icon>
        <h3 class="preview-title">免費試看</h3>
      </div>
      <div class="preview-content">
        <div class="preview-info">
          <span class="preview-chapter">{{ previewLesson.sectionName }}</span>
          <span class="preview-separator">›</span>
          <span class="preview-lesson">{{ previewLesson.lessonTitle }}</span>
          <span class="preview-duration">({{ previewLesson.duration }})</span>
        </div>
        <el-button type="primary" class="preview-btn" @click="handlePreview">
          <el-icon><VideoPlay /></el-icon>
          立即試看
        </el-button>
      </div>
    </div>
    
    <h3 class="stats-title">課程資訊</h3>
    <div class="course-stats">
      <span class="stat-item">
        <el-icon><Clock /></el-icon>
        {{ duration }}
      </span>
      <span class="stat-item">
        <el-icon><Document /></el-icon>
        {{ sections }} sections
      </span>
      <span class="stat-item">
        <el-icon><VideoPlay /></el-icon>
        {{ attachments }} attachments
      </span>
    </div>

    <div v-if="learningPoints && learningPoints.length > 0" class="learning-points">
      <h3 class="learning-title">你將學到</h3>
      <ul class="learning-list">
        <li v-for="(point, index) in learningPoints" :key="index" class="learning-item">
          <el-icon class="check-icon"><Check /></el-icon>
          <span>{{ point }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, Document, VideoPlay, Check } from '@element-plus/icons-vue'

const props = defineProps({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  sections: {
    type: Number,
    required: true
  },
  attachments: {
    type: Number,
    required: true
  },
  learningPoints: {
    type: Array,
    default: () => []
  },
  contentSections: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['preview'])

// 自動取得第一個 section 的第一個 lesson 作為試看單元
const previewLesson = computed(() => {
  if (props.contentSections && props.contentSections.length > 0) {
    const firstSection = props.contentSections[0]
    if (firstSection.lessons && firstSection.lessons.length > 0) {
      const firstLesson = firstSection.lessons[0]
      return {
        sectionName: firstSection.name,
        lessonTitle: firstLesson.title,
        duration: firstLesson.duration,
        sectionIndex: 0,
        lessonIndex: 0
      }
    }
  }
  return null
})

const handlePreview = () => {
  if (previewLesson.value) {
    emit('preview', {
      sectionIndex: previewLesson.value.sectionIndex,
      lessonIndex: previewLesson.value.lessonIndex
    })
  }
}
</script>

<style scoped>
.course-intro {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  margin-bottom: 24px;
}

.intro-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.course-description {
  color: #333;
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 24px 0;
}

.preview-section {
  background: linear-gradient(135deg, #f0f9f4 0%, #e8f5ee 100%);
  border: 2px solid #7ec8a3;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.preview-icon {
  color: #7ec8a3;
  font-size: 24px;
}

.preview-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.preview-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.preview-chapter {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.preview-separator {
  color: #999;
  font-size: 14px;
}

.preview-lesson {
  color: #666;
  font-size: 15px;
}

.preview-duration {
  color: #999;
  font-size: 14px;
  margin-left: 4px;
}

.preview-btn {
  background: #7ec8a3;
  border-color: #7ec8a3;
  font-weight: 600;
  padding: 12px 24px;
  height: auto;
}

.preview-btn:hover {
  background: #6bb890;
  border-color: #6bb890;
}

.preview-btn .el-icon {
  margin-right: 6px;
}

.stats-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.course-stats {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
}

.stat-item .el-icon {
  color: #7ec8a3;
  font-size: 18px;
}

.learning-points {
  margin-top: 32px;
}

.learning-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.learning-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.learning-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: #333;
  line-height: 1.6;
}

.check-icon {
  color: #7ec8a3;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .course-intro {
    padding: 24px 16px;
  }

  .intro-title {
    font-size: 20px;
  }

  .course-description {
    font-size: 14px;
  }

  .preview-section {
    padding: 20px 16px;
  }

  .preview-title {
    font-size: 18px;
  }

  .preview-content {
    flex-direction: column;
    align-items: stretch;
  }

  .preview-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .preview-btn {
    width: 100%;
    justify-content: center;
  }

  .stats-title,
  .learning-title {
    font-size: 18px;
  }

  .course-stats {
    gap: 20px;
  }

  .learning-list {
    grid-template-columns: 1fr;
  }
}
</style>