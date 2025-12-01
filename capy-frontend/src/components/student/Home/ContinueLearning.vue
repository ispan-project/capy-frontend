<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MyLearningCourseCard from '@/components/student/StudentCenter/MyLearning/MyLearningCourseCard.vue'

const router = useRouter()

// 模擬課程資料，結構與 MyLearning 頁面相同
const enrollments = ref([
  {
    id: 1,
    course: {
      id: 1,
      title: 'Java Basic',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: '張老師'
    },
    completion_percentage: 60,
    my_review: null // 未評分
  },
  {
    id: 2,
    course: {
      id: 2,
      title: 'Python Basic',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: '李老師'
    },
    completion_percentage: 40,
    my_review: null
  },
  {
    id: 3,
    course: {
      id: 3,
      title: 'Javascript Basic',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: '王老師'
    },
    completion_percentage: 22,
    my_review: null
  }
])

// 處理評分對話框開啟
const handleOpenRateDialog = (data) => {
  // 在主頁不顯示評分對話框，可以導向到 MyLearning 頁面
  console.log('Rating clicked:', data)
}

// 處理卡片點擊，導航到課程學習頁面
const handleCardClick = (courseId) => {
  router.push(`/student/course-play/${courseId}`)
}
</script>

<template>
  <div class="continue-learning">
    <MyLearningCourseCard
      v-for="enrollment in enrollments"
      :key="enrollment.id"
      :enrollment="enrollment"
      @open-rate-dialog="handleOpenRateDialog"
      @card-click="handleCardClick"
      class="learning-card"
    />
  </div>
</template>

<style scoped>
.continue-learning {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.learning-card {
  width: 100%;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .continue-learning {
    padding: 0 10px;
    gap: 16px;
  }
}
</style>
