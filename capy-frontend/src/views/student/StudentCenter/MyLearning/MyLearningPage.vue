<template>
  <div class="my-learning-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">My Learning(Course)</h1>
      <div class="header-actions">
        <el-button class="filter-btn" :icon="Filter" circle />
        <el-button class="search-btn" :icon="Search" circle />
        <el-dropdown @command="handleFilterChange" trigger="click">
          <el-button type="success" class="sort-btn">
            <el-icon class="sort-icon"><DCaret /></el-icon>
            Sort
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all" :class="{ active: currentFilter === 'all' }">
                All
              </el-dropdown-item>
              <el-dropdown-item command="ongoing" :class="{ active: currentFilter === 'ongoing' }">
                進行中
              </el-dropdown-item>
              <el-dropdown-item command="completed" :class="{ active: currentFilter === 'completed' }">
                已結束
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Course List -->
    <div class="course-list">
      <MyLearningCourseCard
        v-for="enrollment in filteredEnrollments"
        :key="enrollment.id"
        :enrollment="enrollment"
        @open-rate-dialog="handleOpenRateDialog"
        @card-click="goToCourse"
      />
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="filteredEnrollments.length === 0"
      description="No courses found"
      :image-size="120"
    />

    <!-- Pagination -->
    <div v-if="filteredEnrollments.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredEnrollments.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Rating Dialog -->
    <CourseRatingDialog
      v-model="showRatingDialog"
      :course-info="selectedCourseInfo"
      :initial-rating="initialRating"
      :initial-comment="initialComment"
      @review-submitted="handleReviewSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Filter, Search, DCaret } from '@element-plus/icons-vue'
import MyLearningCourseCard from '@/components/student/StudentCenter/MyLearning/MyLearningCourseCard.vue'
import CourseRatingDialog from '@/components/student/StudentCenter/MyLearning/CourseRatingDialog.vue'
import { enrollments } from '@/mockData'

const router = useRouter()

const currentFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(6)

// Rating dialog state
const showRatingDialog = ref(false)
const selectedEnrollmentId = ref(null)
const selectedCourseInfo = ref(null)
const initialRating = ref(0)
const initialComment = ref('')

// 使用統一的學習記錄資料
const allEnrollments = ref(enrollments)

/**
 * Filtered enrollments based on current filter
 */
const filteredEnrollments = computed(() => {
  let enrollments = allEnrollments.value

  if (currentFilter.value === 'ongoing') {
    enrollments = enrollments.filter(e => e.status === 'ongoing')
  } else if (currentFilter.value === 'completed') {
    enrollments = enrollments.filter(e => e.status === 'completed')
  }

  return enrollments
})

/**
 * Handle filter change
 */
const handleFilterChange = (command) => {
  currentFilter.value = command
  currentPage.value = 1
}

/**
 * Handle page change
 */
const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Navigate to course learning page
 */
const goToCourse = (courseId) => {
  router.push(`/course/${courseId}`)
}

/**
 * Handle open rating dialog
 */
const handleOpenRateDialog = ({ enrollment, initialRating: rating }) => {
  selectedEnrollmentId.value = enrollment.id
  selectedCourseInfo.value = enrollment.course
  initialRating.value = rating
  initialComment.value = enrollment.my_review?.comment || ''
  showRatingDialog.value = true
}

/**
 * Handle review submitted
 */
const handleReviewSubmitted = (reviewData) => {
  // Find the enrollment and update its review
  const enrollment = allEnrollments.value.find(e => e.id === selectedEnrollmentId.value)
  if (enrollment) {
    enrollment.my_review = {
      rating: reviewData.rating,
      comment: reviewData.comment
    }
  }

  // Reset dialog state
  selectedEnrollmentId.value = null
  selectedCourseInfo.value = null
  initialRating.value = 0
  initialComment.value = ''
}
</script>

<style scoped>
.my-learning-page {
  padding: 0;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-btn,
.search-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
}

.filter-btn:hover,
.search-btn:hover {
  border-color: var(--capy-primary);
  color: var(--capy-primary);
}

.sort-btn {
  padding: 10px 20px;
  height: 40px;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-btn:hover,
.sort-btn:focus {
  background: var(--capy-primary-dark);
  border-color: var(--capy-primary-dark);
}

.sort-icon {
  font-size: 14px;
}

/* Dropdown Menu */
:deep(.el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item.active) {
  color: var(--capy-primary);
  font-weight: 600;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f5f5f5;
}

/* Course List */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

:deep(.el-pagination) {
  gap: 8px;
}

:deep(.el-pagination button),
:deep(.el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-pager li.is-active) {
  background: #1a1a1a;
  color: white;
}

:deep(.el-pager li:hover) {
  color: var(--capy-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .course-list {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .filter-btn,
  .search-btn {
    width: 36px;
    height: 36px;
  }

  .sort-btn {
    padding: 8px 16px;
    height: 36px;
    font-size: 14px;
  }
}
</style>
