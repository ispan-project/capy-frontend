<template>
  <section class="section">
    <h2 class="section-title-student">Categories</h2>
    <div class="categories">
      <el-tag
        v-for="(category, index) in categories"
        :key="index"
        size="large"
        class="category-tag"
      >
        {{ category }}
      </el-tag>
    </div>
  </section>
</template>

<script setup>
defineProps({
  categories: {
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

.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.category-tag {
  font-size: 16px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-tag:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .section-title-student {
    font-size: 24px;
  }
}
</style>
