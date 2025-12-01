<template>
  <section class="section">
    <h2 class="section-title-student">Golden Teachers</h2>
    <el-row :gutter="20" justify="center">
      <el-col :xs="12" :sm="6" :md="6" v-for="teacher in teachers" :key="teacher.id">
        <TeacherCard :teacher="teacher" />
      </el-col>
    </el-row>
  </section>
</template>

<script setup>
import TeacherCard from './TeacherCard.vue'

defineProps({
  teachers: {
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
