<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const teachers = ref([
  { id: 1, name: "老師一", avatar: "https://picsum.photos/200?1" },
  { id: 2, name: "老師二", avatar: "https://picsum.photos/200?2" },
  { id: 3, name: "老師三", avatar: "https://picsum.photos/200?3" },
  { id: 4, name: "老師四", avatar: "https://picsum.photos/200?4" }
])

const goToTeacher = (id) => {
  router.push(`/teacher/${id}`)
}
</script>

<template>
  <ul class="teachers-list">
    <li
      v-for="teacher in teachers"
      :key="teacher.id"
      class="teacher-item"
      @click="goToTeacher(teacher.id)"
    >
      <el-avatar :size="200" :src="teacher.avatar" />
      <p class="teacher-name">{{ teacher.name }}</p>
    </li>
  </ul>
</template>

<style scoped>
.teachers-list {
  display: flex;
  justify-content: center;
  gap: 100px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.teacher-item {
  cursor: pointer;
  text-align: center;
}

.teacher-name {
  margin-top: 10px;
}
</style>
