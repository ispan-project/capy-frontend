<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const carouselRef = ref(null)

// 響應式狀態：檢測螢幕寬度
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 768)

// 監聽視窗大小變化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const slides = ref([
  {
    id: 1,
    url: "/水豚滑手機.png",
    badge: "學生專區",
    title: "隨時隨地，掌握 AI 時代新技能",
    subtitle: "從程式設計到商業管理，開啟你的學習旅程",
    route: "/Explore"
  },
  {
    id: 2,
    url: "/水豚教課程.png",
    badge: "講師招募",
    title: "將你的專業變現，影響全世界",
    subtitle: "建立課程、追蹤收益，成為 CapyCourse 合作講師",
    route: "/instructor/landing"
  },
  {
    id: 3,
    url: "/水豚介紹網站.png",
    badge: "品牌理念",
    title: "像水豚一樣自在的學習節奏",
    subtitle: "加入我們，體驗最清新的線上學習平台",
    route: "/support/about"
  }
])

const activeIndex = ref(0)

const goToCourse = (route) => {
  router.push(route)
}

const handleChange = (index) => {
  activeIndex.value = index
}

const setActiveSlide = (index) => {
  if (carouselRef.value) {
    carouselRef.value.setActiveItem(index)
  }
  activeIndex.value = index
}
</script>

<template>
  <div class="hero-carousel-wrapper">
    <el-carousel
      ref="carouselRef"
      :interval="5000"
      :type="isMobile ? '' : 'card'"
      :height="isMobile ? '300px' : '400px'"
      :card-scale="0.85"
      @change="handleChange"
      class="hero-carousel"
      :class="{ 'mobile-carousel': isMobile }"
    >
      <el-carousel-item
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="{ 'is-active-slide': index === activeIndex }"
      >
        <div class="slide-container">
          <!-- Dark Overlay for better text contrast -->
          <div class="image-overlay"></div>

          <!-- Image -->
          <img
            :src="slide.url"
            :alt="slide.title"
            class="slide-image"
          />

          <!-- Glassmorphism Content Overlay (Only on Active Slide) -->
          <div
            v-if="index === activeIndex"
            class="content-overlay"
          >
            <!-- Badge -->
            <div class="featured-badge">
              {{ slide.badge }}
            </div>

            <!-- Title & Subtitle -->
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-subtitle">{{ slide.subtitle }}</p>

            <!-- CTA Button -->
            <button
              class="view-details-btn"
              @click.stop="goToCourse(slide.route)"
            >
              查看詳情
            </button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- Custom Indicator Dots -->
    <div class="custom-indicators">
      <div
        v-for="(slide, index) in slides"
        :key="`dot-${slide.id}`"
        :class="['indicator-dot', { 'is-active': index === activeIndex }]"
        @click="setActiveSlide(index)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.hero-carousel-wrapper {
  position: relative;
  width: 100%;
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
  background: linear-gradient(180deg, var(--capy-bg-base) 0%, var(--capy-bg-surface) 100%);
  overflow: hidden;
}

.hero-carousel {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* Carousel Item Styling */
.hero-carousel :deep(.el-carousel__item) {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
}

/* Inactive Slides - Dimmed & Blurred */
.hero-carousel :deep(.el-carousel__item:not(.is-active)) {
  opacity: 0.6;
  filter: blur(2px);
}

.hero-carousel :deep(.el-carousel__item:not(.is-active)) .slide-container {
  transform: scale(0.85);
}

/* Active Slide - Enhanced */
.hero-carousel :deep(.el-carousel__item.is-active) {
  opacity: 1;
  filter: none;
  z-index: 10;
}

.hero-carousel :deep(.el-carousel__item.is-active) .slide-container {
  transform: scale(1.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Slide Container */
.slide-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--capy-radius-lg);
  position: relative;
}

/* Dark overlay for better text readability */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--capy-bg-overlay);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* Show overlay on active slide */
.hero-carousel :deep(.el-carousel__item.is-active) .image-overlay {
  opacity: 1;
}

/* Glassmorphism Content Overlay */
.content-overlay {
  position: absolute;
  bottom: 24px;
  left: 24px;
  max-width: 450px;
  padding: var(--capy-spacing-lg);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--capy-radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.6s ease-out;
  z-index: 3;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Featured Badge */
.featured-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--capy-warning);
  color: white;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-bold);
  border-radius: 20px;
  margin-bottom: var(--capy-spacing-sm);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

/* Title */
.slide-title {
  font-size: 28px;
  font-weight: var(--capy-font-weight-bold);
  color: white;
  margin: 0 0 var(--capy-spacing-sm) 0;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
  line-height: 1.3;
  position: relative;
  z-index: 2;
}

/* Subtitle */
.slide-subtitle {
  font-size: var(--capy-font-size-base);
  color: rgba(255, 255, 255, 0.98);
  margin: 0 0 var(--capy-spacing-lg) 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* CTA Button */
.view-details-btn {
  padding: 10px 24px;
  background: var(--capy-primary);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  cursor: pointer;
  transition: all var(--capy-transition-base);
  box-shadow: 0 4px 12px rgba(0, 191, 165, 0.3);
}

.view-details-btn:hover {
  background: var(--el-color-primary-dark-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 191, 165, 0.4);
}

.view-details-btn:active {
  transform: translateY(0);
}

/* Custom Indicator Dots */
.custom-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: var(--capy-spacing-xl);
}

.indicator-dot {
  width: 12px;
  height: 12px;
  background: var(--capy-border-base);
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--capy-transition-base);
}

.indicator-dot:hover {
  background: var(--capy-text-secondary);
}

.indicator-dot.is-active {
  width: 40px;
  background: var(--capy-primary);
  box-shadow: 0 2px 8px rgba(0, 191, 165, 0.3);
}

/* Hide default Element Plus indicators */
.hero-carousel :deep(.el-carousel__indicators) {
  display: none;
}

/* Mobile Carousel - Full Width Standard Layout */
.mobile-carousel :deep(.el-carousel__item) {
  width: 100% !important;
  transform: none !important;
  opacity: 1 !important;
  filter: none !important;
}

.mobile-carousel .slide-container {
  transform: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.mobile-carousel .slide-image {
  border-radius: 0 !important;
  aspect-ratio: 16/9;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-carousel-wrapper {
    padding: var(--capy-spacing-xl) var(--capy-spacing-md);
    padding-bottom: var(--capy-spacing-xxl);
    overflow: visible;
  }

  .hero-carousel {
    height: 360px;
    margin-bottom: var(--capy-spacing-lg);
    overflow: visible;
  }

  .hero-carousel :deep(.el-carousel__container) {
    overflow: visible;
  }

  .slide-title {
    font-size: 24px;
  }

  .content-overlay {
    max-width: 380px;
    padding: var(--capy-spacing-md);
  }

  .custom-indicators {
    margin-top: var(--capy-spacing-xl);
    margin-bottom: var(--capy-spacing-md);
  }
}

@media (max-width: 768px) {
  .hero-carousel-wrapper {
    padding: var(--capy-spacing-md) var(--capy-spacing-sm);
  }

  .hero-carousel {
    height: 300px;
  }

  /* Mobile: Image on Top, Text on Bottom Layout */
  .content-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: none;
    padding: var(--capy-spacing-md);
    padding-bottom: 40px; /* 防止 CTA 按鈕觸碰底部邊緣 */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 100%);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 0;
    border: none;
  }

  .image-overlay {
    opacity: 0.5 !important; /* 增強深色遮罩確保白色文字可讀 */
  }

  .slide-title {
    font-size: 20px;
  }

  .slide-subtitle {
    font-size: var(--capy-font-size-sm);
  }

  .view-details-btn {
    padding: 8px 20px;
    font-size: var(--capy-font-size-sm);
  }

  .featured-badge {
    top: var(--capy-spacing-sm);
    right: var(--capy-spacing-sm);
  }

  /* Hide custom indicators on mobile, use default */
  .custom-indicators {
    margin-top: var(--capy-spacing-md);
  }
}

@media (max-width: 480px) {
  .hero-carousel-wrapper {
    padding: var(--capy-spacing-sm) var(--capy-spacing-xs);
  }

  .hero-carousel {
    height: 280px;
  }

  .content-overlay {
    padding: var(--capy-spacing-sm);
  }

  .slide-title {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .slide-subtitle {
    font-size: 12px;
    margin-bottom: var(--capy-spacing-sm);
  }

  .featured-badge {
    font-size: 10px;
    padding: 4px 10px;
  }

  .view-details-btn {
    padding: 6px 16px;
    font-size: 12px;
  }
}
</style>
