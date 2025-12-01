<template>
  <div class="teacher-card">
    <el-avatar :size="120" :src="teacher.avatar" class="teacher-avatar">
      {{ teacher.name.charAt(0) }}
    </el-avatar>
    <h3 class="teacher-name">{{ teacher.name }}</h3>
    <p class="teacher-subject">{{ teacher.subject }}</p>
  </div>
</template>

<script setup>
defineProps({
  teacher: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.teacher-card {
  text-align: center;
  padding: 20px;
  transition: transform 0.3s;
  cursor: pointer;
}

.teacher-card:hover {
  transform: translateY(-5px);
}

.teacher-avatar {
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.teacher-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.teacher-subject {
  font-size: 14px;
  color: #666;
}
</style>