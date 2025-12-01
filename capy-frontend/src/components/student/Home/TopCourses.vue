<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
// 👇 1. 引入 Autoplay 模組
import { Autoplay, Navigation } from 'swiper/modules';
// import { Pagination, Navigation } from 'swiper/modules'
import { TrophyBase, ShoppingCart } from '@element-plus/icons-vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const router = useRouter()
const modules = [Autoplay, Navigation]


const coursesData = ref([
  {
    id: 1,
    img: "https://picsum.photos/400/225?1",
    title: "Java 完整開發課程",
    instructor: "張老師",
    rating: 4.8,
    price: 2990,
    buycount: 1240,
    tags: ["Java", "後端開發", "Spring"]
  },
  {
    id: 2,
    img: "https://picsum.photos/400/225?2",
    title: "Python 數據分析實戰",
    instructor: "李老師",
    rating: 4.7,
    price: 3490,
    buycount: 980,
    tags: ["Python", "數據分析", "機器學習"]
  },
  {
    id: 3,
    img: "https://picsum.photos/400/225?3",
    title: "Vue3 前端框架精通",
    instructor: "王老師",
    rating: 4.9,
    price: 2790,
    buycount: 1560,
    tags: ["Vue3", "前端開發"]
  },
  {
    id: 4,
    img: "https://picsum.photos/400/225?4",
    title: "Spring Boot 微服務架構",
    instructor: "陳老師",
    rating: 4.6,
    price: 3990,
    buycount: 850,
    tags: ["Spring Boot", "微服務", "Java"]
  }
])

const courses = computed(() =>
  [...coursesData.value].sort((a, b) => b.buycount - a.buycount)
)

const goToCourse = (id) => {
  router.push(`/course/${id}`)
}

const formatPrice = (price) => {
  return price.toLocaleString('zh-TW')
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
      <div class="course-card" @click="goToCourse(course.id)">
        <!-- Image Area -->
        <div class="image-area">
          <img :src="course.img" :alt="course.title" class="course-img" />

          <!-- Bestseller Badge -->
          <div class="bestseller-badge">
            <el-icon><TrophyBase /></el-icon>
            <span>熱銷</span>
          </div>
        </div>

        <!-- Course Info -->
        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>

          <!-- Tags below title -->
          <div class="tags-container" v-if="course.tags && course.tags.length > 0">
            <span
              v-for="(tag, index) in course.tags"
              :key="index"
              class="tag-item"
            >
              {{ tag }}
            </span>
          </div>

          <p class="course-instructor">{{ course.instructor }}</p>

          <div class="course-meta">
            <div class="rating">
              <el-rate
                :model-value="course.rating"
                disabled
                show-score
                :score-template="`${course.rating}`"
              />
            </div>

            <div class="price-section">
              <span class="price">NT$ {{ formatPrice(course.price) }}</span>
            </div>
          </div>

          <div class="purchase-info">
            <el-icon class="purchase-icon"><ShoppingCart /></el-icon>
            <span class="purchase-count">{{ course.buycount }} 人購買</span>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
.course-swiper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px var(--capy-spacing-lg);
}

.course-swiper :deep(.swiper-button-next),
.course-swiper :deep(.swiper-button-prev) {
  color: var(--capy-primary);
  background: var(--capy-bg-surface);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: var(--capy-shadow-md);
  transition: all var(--capy-transition-base);
  cursor: pointer;
}

.course-swiper :deep(.swiper-button-next):hover,
.course-swiper :deep(.swiper-button-prev):hover {
  background: var(--capy-primary);
  color: white;
  transform: scale(1.1);
}

.course-swiper :deep(.swiper-button-next):after,
.course-swiper :deep(.swiper-button-prev):after {
  font-size: 20px;
  font-weight: bold;
}

.course-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  box-shadow: var(--capy-shadow-sm);
  border: 1px solid var(--capy-border-lighter);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--capy-primary);
}

.image-area {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: var(--capy-bg-base);
}

.course-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--capy-transition-base);
}

.course-card:hover .course-img {
  transform: scale(1.05);
}

/* Bestseller Badge */
.bestseller-badge {
  position: absolute;
  top: var(--capy-spacing-sm);
  right: var(--capy-spacing-sm);
  background: rgba(230, 162, 60, 0.95);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: white;
  padding: 6px 12px;
  border-radius: var(--capy-radius-base);
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-bold);
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.course-content {
  padding: var(--capy-spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: var(--capy-font-size-md);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-sm) 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
}

/* Tags Container */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--capy-spacing-sm);
}

.tag-item {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(0, 191, 165, 0.1);
  color: var(--capy-primary);
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-semibold);
  border-radius: 12px;
  border: 1px solid rgba(0, 191, 165, 0.2);
  transition: all var(--capy-transition-fast);
}

.tag-item:hover {
  background: rgba(0, 191, 165, 0.15);
  border-color: var(--capy-primary);
}

.course-instructor {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
  margin-bottom: var(--capy-spacing-sm);
}

.rating :deep(.el-rate) {
  height: auto;
}

.rating :deep(.el-rate__icon) {
  font-size: 14px;
  color: var(--capy-warning);
}

.rating :deep(.el-rate__text) {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-warning);
  margin-left: 4px;
}

.price-section {
  display: flex;
  align-items: center;
}

.price {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: var(--capy-spacing-sm);
  margin-top: auto;
  border-top: 1px solid var(--capy-border-lighter);
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.purchase-icon {
  color: var(--capy-primary);
  font-size: 16px;
}

.purchase-count {
  font-weight: var(--capy-font-weight-medium);
}

@media (max-width: 768px) {
  .course-swiper {
    padding: 0 20px var(--capy-spacing-md);
  }

  .course-title {
    font-size: var(--capy-font-size-sm);
  }

  .course-content {
    padding: var(--capy-spacing-sm);
  }
}
</style>
