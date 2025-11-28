<script setup>
import Navbar from '@/views/student/Home/Navbar.vue'
import Carousel from '@/views/student/Home/Carousel.vue'
import GoldenTeachers from '@/views/student/Home/GoldenTeachers.vue'
import LatestCourses from '@/views/student/Home/LatestCourses.vue'
import Tags from '@/views/student/Home/tags.vue'
import TopCourses from '@/views/student/Home/TopCourses.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Navbar />
      </el-header>

      <el-main>
        <Carousel />

        <h1 class="section-title">Top Courses</h1>
        <TopCourses />

        <h1 class="section-title">Tags</h1>
        <Tags />

        <h1 class="section-title">Latest Courses</h1>
        <LatestCourses />

        <h1 class="section-title">Golden Teacher</h1>
        <GoldenTeachers />
      </el-main>

      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.section-title {
  text-align: center;
  margin: 2rem 0 1rem;
}
</style>
