<script setup>
import { ref, computed } from 'vue'

const tagsData = ref([
  { id: 1, name: "Java Basic", hot: 95 },
  { id: 2, name: "Python Basic", hot: 88 },
  { id: 3, name: "JavaScript Basic", hot: 76 },
  { id: 4, name: "SQL Basic", hot: 64 }
])

const sortedTags = computed(() =>
  [...tagsData.value].sort((a, b) => b.hot - a.hot)
)
</script>

<template>
  <div class="tags-container">
    <el-button
      v-for="tag in sortedTags"
      :key="tag.id"
      type="primary"
    >
      {{ tag.name }}
    </el-button>
  </div>
</template>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}
</style>
