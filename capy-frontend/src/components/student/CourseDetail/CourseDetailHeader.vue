<template>
  <div class="course-header">
    <div class="header-content">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/explore' }">Courses</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
      
      <h1 class="course-title">{{ title }}</h1>
      <p class="course-description">{{ description }}</p>
      
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
    </div>
  </div>
</template>

<script setup>
import { Clock, Document, VideoPlay } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  },
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
  }
})
</script>

<style scoped>
.course-header {
  color:black;
  padding: 40px 24px;
}

.header-content {
  max-width: 1320px;
  margin: 0 auto;
}

.header-content :deep(.el-breadcrumb__inner) {
  color: black
}

.header-content :deep(.el-breadcrumb__inner:hover) {
  color: black;
}

.header-content :deep(.el-breadcrumb__separator) {
  color: black
}

.course-title {
  font-size: 36px;
  font-weight: 700;
  margin: 20px 0 16px 0;
  line-height: 1.3;
}

.course-description {
  color: black;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px 0;
  opacity: 0.95;
  max-width: 800px;
}

.course-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

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
}
</style>