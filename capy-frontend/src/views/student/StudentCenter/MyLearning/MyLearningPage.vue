<template>
  <div class="my-learning-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">我的課程</h1>
      <div class="header-actions">
        <el-dropdown @command="handleFilterChange" trigger="click">
          <el-button type="primary" class="filter-status-btn">
            <el-icon class="filter-icon"><Filter /></el-icon>
            {{ currentFilterLabel }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all" :class="{ active: filterStatus === 'all' }">
                全部狀態
              </el-dropdown-item>
              <el-dropdown-item command="in_progress" :class="{ active: filterStatus === 'in_progress' }">
                進行中
              </el-dropdown-item>
              <el-dropdown-item command="completed" :class="{ active: filterStatus === 'completed' }">
                已完課
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Course List -->
    <div class="course-list">
      <MyLearningCourseCard
        v-for="course in myLearningContent"
        :key="course.progressId"
        :course="course"
        @open-rate-dialog="handleOpenRateDialog"
        @card-click="goToCourse"
      />
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="myLearningContent.length === 0 && !loading"
      description="尚無課程"
      :image-size="120"
    />

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>載入中...</span>
    </div>

    <!-- Pagination -->
    <div v-if="totalElements > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalElements"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Filter, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MyLearningCourseCard from '@/components/student/StudentCenter/MyLearning/MyLearningCourseCard.vue'
import CourseRatingDialog from '@/components/student/StudentCenter/MyLearning/CourseRatingDialog.vue'
import { getStudentProfile } from '@/api/student/Studentcenter'

const router = useRouter()

// 狀態管理
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(5) // 與後端一致
const loading = ref(false)

// Rating dialog state
const showRatingDialog = ref(false)
const selectedProgressId = ref(null)
const selectedCourseInfo = ref(null)
const initialRating = ref(0)
const initialComment = ref('')

// 使用與後端一致的資料結構
const myLearningContent = ref([])
const totalElements = ref(0)
const totalPages = ref(0)

/**
 * Current filter label for button display
 */
const currentFilterLabel = computed(() => {
  const labels = {
    all: '全部狀態',
    in_progress: '進行中',
    completed: '已完課'
  }
  return labels[filterStatus.value] || '全部狀態'
})

/**
 * 載入我的學習資料
 */
const loadMyLearning = async () => {
  loading.value = true
  try {
    const response = await getStudentProfile()
    const myLearning = response.myLearning

    // 使用後端的資料結構
    myLearningContent.value = myLearning.content || []
    totalElements.value = myLearning.totalElements || 0
    totalPages.value = myLearning.totalPages || 0

    console.log('我的學習資料:', myLearningContent.value)
  } catch (error) {
    console.error('載入我的學習資料失敗:', error)
    ElMessage.error('載入課程失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

/**
 * Handle filter change
 */
const handleFilterChange = (command) => {
  filterStatus.value = command
  currentPage.value = 1
  // TODO: 實作篩選邏輯（可能需要後端支援）
  // loadMyLearning()
}

/**
 * Handle page change
 */
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // TODO: 實作分頁邏輯（需要後端支援分頁參數）
  // loadMyLearning()
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
const handleOpenRateDialog = ({ course, initialRating: rating }) => {
  selectedProgressId.value = course.progressId
  selectedCourseInfo.value = {
    courseId: course.courseId,
    courseTitle: course.courseTitle,
    coverImageUrl: course.coverImageUrl,
    instructorName: course.instructorName
  }
  initialRating.value = rating || course.rating || 0
  initialComment.value = course.rateComment || ''
  showRatingDialog.value = true
}

/**
 * Handle review submitted
 */
const handleReviewSubmitted = (reviewData) => {
  // 更新本地資料
  const course = myLearningContent.value.find(c => c.progressId === selectedProgressId.value)
  if (course) {
    course.rating = reviewData.rating
    course.rateComment = reviewData.comment
  }

  // Reset dialog state
  selectedProgressId.value = null
  selectedCourseInfo.value = null
  initialRating.value = 0
  initialComment.value = ''

  ElMessage.success('評價已提交')
}

// 組件掛載時載入資料
onMounted(() => {
  loadMyLearning()
})
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

.filter-status-btn {
  padding: 10px 20px;
  height: 40px;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-status-btn:hover,
.filter-status-btn:focus {
  background: var(--capy-primary-dark);
  border-color: var(--capy-primary-dark);
}

.filter-icon {
  font-size: 16px;
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

/* Loading State */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--capy-text-secondary);
}

.loading-wrapper .el-icon {
  font-size: 32px;
  color: var(--capy-primary);
}

.loading-wrapper span {
  font-size: 14px;
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

  .filter-status-btn {
    padding: 8px 16px;
    height: 36px;
    font-size: 14px;
  }
}
</style>
