<template>
  <div class="course-content-wrapper">
    <!-- Course Header Section (只有麵包屑和標題) -->
    <div v-if="showHeader" class="course-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/explore' }">Courses</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>

      <h1 class="course-title">{{ title }}</h1>
    </div>

    <!-- Course Content Section (可獨立移動) -->
    <div v-if="showContent" class="course-content">
      <h2 class="section-title-student">Course Content</h2>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item
        v-for="(section, index) in sections"
        :key="index"
        :name="index"
      >
        <template #title>
          <div class="section-header">
            <span class="section-name">{{ section.name }}</span>
            <el-icon class="collapse-icon"><ArrowRight /></el-icon>
          </div>
        </template>
        <div class="section-content">
          <div
            v-for="(lesson, lessonIndex) in section.lessons"
            :key="lessonIndex"
            class="lesson-item"
          >
            <span class="lesson-number">{{ lessonIndex + 1 }}.</span>
            <span class="lesson-title">{{ lesson.title }}</span>
            <span class="lesson-duration">{{ lesson.duration }}</span>
            <el-tag v-if="lesson.preview" size="small" type="info">Preview</el-tag>
          </div>
        </div>
      </el-collapse-item>
      </el-collapse>

    <div>
        <p class="course-description">{{ description }}</p>
    </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  sections: {
    type: Array,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showContent: {
    type: Boolean,
    default: true
  }
})

const activeNames = ref([0])
</script>

<style scoped>
.course-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Course Header Styles */
.course-header {
  color: black;
  padding: 40px 24px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
}

/* Course Content Styles */
.course-content {
  background: #fff;
  border-radius: 8px;
  padding: 0;
  margin-bottom: 24px;
}

.course-header :deep(.el-breadcrumb__inner) {
  color: black;
}

.course-header :deep(.el-breadcrumb__inner:hover) {
  color: black;
}

.course-header :deep(.el-breadcrumb__separator) {
  color: black;
}

.course-title {
  font-size: 36px;
  font-weight: 700;
  margin: 20px 0 0 0;
  line-height: 1.3;
}

.section-title-student {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding: 24px 24px 0 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: 600;
  font-size: 16px;
}

.section-name {
  flex: 1;
}

.collapse-icon {
  margin-left: 8px;
  transition: transform 0.3s;
}

.el-collapse-item.is-active .collapse-icon {
  transform: rotate(90deg);
}

.section-content {
  padding: 12px 24px;
}

.el-collapse {
  padding: 0 24px 24px 24px;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-number {
  color: #666;
  font-size: 14px;
  min-width: 24px;
}

.lesson-title {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.lesson-duration {
  color: #999;
  font-size: 13px;
}

:deep(.el-collapse) {
  border: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .course-header {
    padding: 24px 16px;
  }

  .course-title {
    font-size: 24px;
  }

  .course-description {
    font-size: 14px;
  }

  .section-title-student {
    padding: 24px 16px 0 16px;
  }

  .el-collapse {
    padding: 0 16px 24px 16px;
  }

  .section-content {
    padding: 12px 16px;
  }
}

:deep(.el-collapse-item__header) {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: none;
  font-size: 16px;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}
</style>
