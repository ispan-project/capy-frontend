<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const searchInput = ref('')
const router = useRouter()

const handleLogin = () => {
  router.push('/LoginPage')
}
</script>

<template>
  <nav class="navbar">
    <el-button type="primary" class="explore-btn">探索</el-button>

    <el-input
      v-model="searchInput"
      class="search-input"
      placeholder="課程搜尋"
      clearable
      :prefix-icon="Search"
    />

    <el-button type="primary" class="teacher-btn">成為老師</el-button>
    <el-button type="primary" @click="handleLogin">登入/註冊</el-button>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.explore-btn {
  flex-shrink: 0;
  width: 100px;
  height: 40px;
}

.search-input {
  flex-grow: 1;
  min-width: 300px;
  height: 40px;
}

.teacher-btn {
  flex-shrink: 0;
  height: 40px;
}
</style>
