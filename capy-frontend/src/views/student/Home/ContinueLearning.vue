<script setup>
import { ref } from 'vue'

const courses = ref([
  {
    id: 1,
    title: 'Java Basic',
    img_url: 'https://picsum.photos/200',
    percent: 60
  },
  {
    id: 2,
    title: 'Python Basic',
    img_url: 'https://picsum.photos/200',
    percent: 40
  },
  {
    id: 3,
    title: 'Javascript Basic',
    img_url: 'https://picsum.photos/200',
    percent: 22
  }
])
</script>

<template>
  <div class="continue-learning">
    <el-card v-for="item in courses" :key="item.id" class="course-card">
      <template #header>{{ item.title }}</template>
      <img :src="item.img_url" class="course-img" />
      <el-progress :percentage="item.percent" />
    </el-card>
  </div>
</template>

<style scoped>
.continue-learning {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.course-card {
  max-width: 250px;
}

.course-img {
  width: 50%;
}
</style>
