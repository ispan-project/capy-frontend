<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Pagination, Navigation]

const coursesData = ref([
  { id: 1, img: "https://picsum.photos/200", text: "java", createdAt: "2025-01-21" },
  { id: 2, img: "https://picsum.photos/200", text: "python", createdAt: "2025-01-19" },
  { id: 3, img: "https://picsum.photos/200", text: "Vue3", createdAt: "2025-01-29" },
  { id: 4, img: "https://picsum.photos/200", text: "Spring Boot", createdAt: "2025-01-28" }
])

const courses = computed(() =>
  [...coursesData.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)
</script>

<template>
  <swiper
    :slides-per-view="3"
    :centered-slides="false"
    :space-between="30"
    :navigation="true"
    :modules="modules"
    :breakpoints="{
      768: { slidesPerView: 3, spaceBetween: 20 },
      480: { slidesPerView: 1, spaceBetween: 10 }
    }"
    class="course-swiper"
  >
    <swiper-slide v-for="course in courses" :key="course.id">
      <div class="slide-wrapper">
        <div class="image-area">
          <img :src="course.img" :alt="course.text">
        </div>
        <p class="slide-text">{{ course.text }}</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
.course-swiper {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
}

.slide-wrapper {
  width: 100%;
  text-align: center;
}

.image-area {
  height: 200px;
  background-color: #d3dce6;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-area img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-text {
  margin-top: 10px;
  font-size: 18px;
  color: #333;
}
</style>
