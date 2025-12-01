<template>
  <section class="section">
    <h2 class="section-title-student">{{ title }}</h2>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="course in courses" :key="course.id">
        <CourseCard :course="course" />
      </el-col>
    </el-row>
  </section>
</template>

<script setup>
import CourseCard from './CourseCard.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  courses: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.section-title-student {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

@media (max-width: 768px) {
  .section-title-student {
    font-size: 24px;
  }
}
</style>
