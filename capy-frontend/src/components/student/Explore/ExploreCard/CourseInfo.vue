<template>
  <div class="course-info">
    <!-- Title -->
    <h3 class="course-title">{{ course.title }}</h3>

    <!-- Teacher -->
    <p class="course-teacher">by {{ course.instructor || course.instructor_name || '未知講師' }}</p>

    <!-- Rating -->
    <div class="course-rating">
      <el-rate
        :model-value="course.rating"
        disabled
        show-score
        :score-template="`${course.rating}`"
      />
      <span class="rating-count">({{ formatCount(course.reviewCount) }})</span>
    </div>

    <!-- Price -->
    <div class="course-price">
      <span class="price">NT$ {{ formatPrice(course.price) }}</span>
    </div>

    <!-- Tags -->
    <div class="course-tags">
      <el-tag
        v-for="tag in course.tags"
        :key="tag"
        size="small"
        type="info"
        effect="plain"
        class="clickable-tag"
        @click="handleTagClick(tag, $event)"
      >
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['tag-click'])

const formatCount = (count) => {
  if (count == null) {
    return '0'
  }

  const num = Number(count)
  if (Number.isNaN(num)) {
    return String(count)
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

const formatPrice = (price) => {
  if (price == null) {
    return '0'
  }
  return price.toLocaleString('zh-TW')
}

const handleTagClick = (tag, event) => {
  // 阻止事件冒泡，避免觸發卡片的點擊事件
  event.stopPropagation()
  emit('tag-click', tag)
}
</script>


<style scoped>
.course-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 44px;
}

.course-teacher {
  font-size: 13px;
  color: #909399;
  margin: 0 0 12px 0;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.course-rating :deep(.el-rate) {
  height: auto;
}

.course-rating :deep(.el-rate__text) {
  font-size: 14px;
  font-weight: 600;
  color: #f39c12;
}

.rating-count {
  font-size: 13px;
  color: #909399;
}

.course-price {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.course-tags :deep(.el-tag) {
  border-radius: 4px;
  font-size: 12px;
}

.clickable-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.clickable-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* RWD */
@media (max-width: 768px) {
  .course-title {
    font-size: 15px;
  }

  .course-info {
    padding: 14px;
  }
}
</style>