<template>
  <div class="course-card" @click="handleCardClick">
    <!-- Thumbnail -->
    <div class="course-thumbnail">
      <img :src="enrollment.course.cover_image_url" :alt="enrollment.course.title" />
    </div>

    <!-- Course Info -->
    <div class="course-info">
      <!-- Title -->
      <h3 class="course-title">{{ enrollment.course.title }}</h3>

      <!-- Instructor -->
      <p class="course-instructor">{{ enrollment.course.instructor_name }}</p>

      <!-- Progress Bar -->
      <div class="progress-section">
        <el-progress 
          :percentage="enrollment.completion_percentage" 
          :stroke-width="6"
          :color="progressColor"
        />
        <span class="progress-text">{{ enrollment.completion_percentage }}%</span>
      </div>

      <!-- Rating Section -->
      <div class="rating-section" @click.stop>
        <el-rate
          v-model="displayRating"
          :disabled="isRated"
          :void-icon="StarIcon"
          :colors="ratingColors"
          @change="handleRatingClick"
          class="rating-stars"
        />
        <span class="rating-text">{{ ratingText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Star } from '@element-plus/icons-vue'

const props = defineProps({
  enrollment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-rate-dialog', 'card-click'])

// Icons
const StarIcon = Star

/**
 * Check if course is already rated
 */
const isRated = computed(() => {
  return !!props.enrollment.my_review
})

/**
 * Display rating value
 */
const displayRating = computed({
  get() {
    return props.enrollment.my_review?.rating || 0
  },
  set(value) {
    // This will be handled by handleRatingClick
  }
})

/**
 * Rating text
 */
const ratingText = computed(() => {
  if (isRated.value) {
    return '您的評分'
  }
  return '留下評分'
})

/**
 * Rating colors
 */
const ratingColors = computed(() => {
  return ['#FFD700', '#FFD700', '#FFD700']
})

/**
 * Progress bar color
 */
const progressColor = computed(() => {
  return 'var(--capy-primary)'
})

/**
 * Handle rating star click
 */
const handleRatingClick = (value) => {
  if (!isRated.value && value > 0) {
    emit('open-rate-dialog', {
      enrollment: props.enrollment,
      initialRating: value
    })
  }
}

/**
 * Handle card click (navigate to course)
 */
const handleCardClick = () => {
  emit('card-click', props.enrollment.course.id)
}
</script>

<style scoped>
.course-card {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Thumbnail */
.course-thumbnail {
  flex-shrink: 0;
  width: 200px;
  height: 112px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-fill-color-light);
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Course Info */
.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-instructor {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

/* Progress Section */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.progress-section :deep(.el-progress) {
  flex: 1;
}

.progress-section :deep(.el-progress__text) {
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-primary);
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-primary);
  min-width: 45px;
  text-align: right;
}

/* Rating Section */
.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.rating-stars {
  cursor: pointer;
}

.rating-stars :deep(.el-rate__icon) {
  font-size: 18px;
  margin-right: 4px;
}

/* Unrated stars - gray void icons */
.rating-stars :deep(.el-rate__icon.el-icon) {
  color: #C0C4CC;
}

/* Rated stars - yellow filled */
.rating-stars :deep(.el-rate__icon.is-active) {
  color: #FFD700;
}

/* Hover effect for unrated stars */
.rating-stars:not(.is-disabled):hover :deep(.el-rate__icon) {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.rating-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .course-card {
    flex-direction: column;
    gap: 16px;
  }

  .course-thumbnail {
    width: 100%;
    height: 180px;
  }

  .course-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .course-card {
    padding: 16px;
  }

  .course-title {
    font-size: 15px;
  }

  .progress-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .progress-text {
    min-width: auto;
  }

  .rating-section {
    flex-wrap: wrap;
  }
}
</style>