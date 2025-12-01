<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import Carousel from '@/components/student/Home/Carousel.vue'
import GoldenTeachers from '@/components/student/Home/GoldenTeachers.vue'
import LatestCourses from '@/components/student/Home/LatestCourses.vue'
import Tags from '@/components/student/Home/tags.vue'
import TopCourses from '@/components/student/Home/TopCourses.vue'
import ContinueLearning from '@/components/student/Home/ContinueLearning.vue'

// 使用 user store 來判斷登入狀態
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isAuthenticated)
</script>

<template>
  <div class="home-content">
    <Carousel />

    <!-- 登入後才顯示：繼續學習 -->
    <template v-if="isLoggedIn">
      <h1 class="section-title-student">Continue Learning</h1>
      <ContinueLearning />
    </template>

    <h1 class="section-title-student">Top Courses</h1>
    <TopCourses />

    <h1 class="section-title-student">Tags</h1>
    <Tags />

    <h1 class="section-title-student">Latest Courses</h1>
    <LatestCourses />

    <h1 class="section-title-student">Golden Teachers</h1>
    <GoldenTeachers />
  </div>
</template>

<style scoped>
.home-content {
  padding: 20px;
}

.section-title-student {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0 1.5rem;
  font-size: 24px;
  font-weight: bold;
}

/* Continue Learning 區塊樣式調整 */
.home-content > h1.section-title-student:first-of-type {
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .home-content {
    padding: 10px;
  }

  .section-title-student {
    font-size: 20px;
    margin: 1.5rem 0 1rem;
  }
}
</style>
