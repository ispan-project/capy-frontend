<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules';
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Autoplay, Navigation]

const coursesData = ref([
  {
    id: 1,
    cover: "https://picsum.photos/400/225",
    title: "Java 完整開發課程",
    instructor: "張老師",
    rating: 4.5,
    reviewCount: 1234,
    price: 2990,
    tags: ["Java", "後端開發"],
    isWishlisted: false,
    createdAt: "2025-01-21"
  },
  {
    id: 2,
    cover: "https://picsum.photos/400/226",
    title: "Python 數據分析實戰",
    instructor: "李老師",
    rating: 4.8,
    reviewCount: 856,
    price: 3490,
    tags: ["Python", "數據分析"],
    isWishlisted: false,
    createdAt: "2025-01-19"
  },
  {
    id: 3,
    cover: "https://picsum.photos/400/227",
    title: "Vue3 前端框架精通",
    instructor: "王老師",
    rating: 4.7,
    reviewCount: 2341,
    price: 2790,
    tags: ["Vue3", "前端開發"],
    isWishlisted: false,
    createdAt: "2025-01-29"
  },
  {
    id: 4,
    cover: "https://picsum.photos/400/228",
    title: "Spring Boot 微服務架構",
    instructor: "陳老師",
    rating: 4.6,
    reviewCount: 1567,
    price: 3990,
    tags: ["Spring Boot", "微服務"],
    isWishlisted: false,
    createdAt: "2025-01-28"
  }
])

const courses = computed(() =>
  [...coursesData.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

const toggleWishlist = (courseId) => {
  const course = coursesData.value.find(c => c.id === courseId)
  if (course) {
    course.isWishlisted = !course.isWishlisted
  }
}

const handleTagClick = (tag) => {
  console.log('Tag clicked:', tag)
  // 可以在這裡添加標籤點擊的處理邏輯，例如導航到探索頁面並篩選該標籤
}
</script>

<template>
  <swiper
    :loop="true"
    :slides-per-view="3"
    :centered-slides="false"
    :space-between="30"
    :navigation="true"
    :modules="modules"
    :autoplay="{
      delay: 5000,                // 每 3 秒切換一次
      disableOnInteraction: false, // 手動滑動後，自動播放「不會」停止 (重要!)
      pauseOnMouseEnter: true     // 滑鼠移入時暫停 (提升 UX)
    }"
    :breakpoints="{
      1024: { slidesPerView: 3, spaceBetween: 30 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      480: { slidesPerView: 1, spaceBetween: 10 }
    }"
    class="course-swiper"
  >
    <swiper-slide v-for="course in courses" :key="course.id">
      <ExploreCourseCard
        :course="course"
        @toggle-wishlist="toggleWishlist"
        @tag-click="handleTagClick"
      />
    </swiper-slide>
  </swiper>
</template>

<style scoped>
.course-swiper {
  width: 100%;
  max-width: 1280px;
  margin: 20px auto;
  padding: 0 40px;
}

.course-swiper :deep(.swiper-button-next),
.course-swiper :deep(.swiper-button-prev) {
  color: var(--capy-primary);
  cursor: pointer;
}

.course-swiper :deep(.swiper-button-next):after,
.course-swiper :deep(.swiper-button-prev):after {
  font-size: 24px;
}

@media (max-width: 768px) {
  .course-swiper {
    padding: 0 20px;
  }
}
</style>
