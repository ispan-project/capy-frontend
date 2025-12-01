<script setup>
import { ref } from 'vue'

const images = ref([
  { id: 1, url: "https://picsum.photos/id/1015/800/400" },
  { id: 2, url: "https://picsum.photos/id/1016/800/400" },
  { id: 3, url: "https://picsum.photos/id/1018/800/400" },
  { id: 4, url: "https://picsum.photos/id/1020/800/400" }
])
</script>

<template>
  <el-carousel :interval="3000" type="card" height="400px">
    <el-carousel-item v-for="item in images" :key="item.id">
      <img :src="item.url" :alt="`課程 ${item.id}`" class="carousel-img">
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
</style>
