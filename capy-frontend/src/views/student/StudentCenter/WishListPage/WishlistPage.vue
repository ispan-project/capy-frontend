<template>
  <div class="wishlist-page">
    <div class="page-header">
      <h1 class="page-title">My Wishlist</h1>

      <el-dropdown v-if="wishlistCourses.length > 0" trigger="click" @command="handleSort">
        <el-button class="sort-button">
          <el-icon><Sort /></el-icon>
          Sort
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="newest">Newest First</el-dropdown-item>
            <el-dropdown-item command="oldest">Oldest First</el-dropdown-item>
            <el-dropdown-item command="title">Title A-Z</el-dropdown-item>
            <el-dropdown-item command="price-low">Price: Low to High</el-dropdown-item>
            <el-dropdown-item command="price-high">Price: High to Low</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="wishlistCourses.length === 0"
      description="Your wishlist is empty"
      :image-size="150"
    >
      <el-button type="primary" @click="goToExplore">
        Explore Courses
      </el-button>
    </el-empty>

    <!-- Course Grid -->
    <div v-else class="courses-grid">
      <ExploreCourseCard
        v-for="course in paginatedCourses"
        :key="course.id"
        :course="course"
        @toggle-wishlist="handleToggleWishlist"
      />
    </div>

    <!-- Pagination -->
    <div v-if="wishlistCourses.length > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="wishlistCourses.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Sort } from '@element-plus/icons-vue'
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const wishlistStore = useWishlistStore()

const currentPage = ref(1)
const pageSize = ref(8)
const sortBy = ref('newest')

// 將 wishlist store 的資料轉換為 ExploreCourseCard 需要的格式
const wishlistCourses = computed(() => {
  return wishlistStore.items.map(item => ({
    id: item.courseId,
    title: item.title,
    instructor: item.instructor,
    cover: item.coverImageUrl,
    rating: 4.5, // 預設評分，實際應該從課程資料取得
    reviewCount: 0, // 預設評論數，實際應該從課程資料取得
    price: item.price,
    originalPrice: item.price * 1.5, // 預設原價，實際應該從課程資料取得
    isWishlisted: true,
    tags: [] // 預設標籤，實際應該從課程資料取得
  }))
})

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedCourses.value.slice(start, end)
})

const sortedCourses = computed(() => {
  const courses = [...wishlistCourses.value]

  switch (sortBy.value) {
    case 'newest':
      // 根據 addedAt 排序（最新的在前）
      return courses.sort((a, b) => {
        const itemA = wishlistStore.items.find(item => item.courseId === a.id)
        const itemB = wishlistStore.items.find(item => item.courseId === b.id)
        return (itemB?.addedAt || 0) - (itemA?.addedAt || 0)
      })
    case 'oldest':
      // 根據 addedAt 排序（最舊的在前）
      return courses.sort((a, b) => {
        const itemA = wishlistStore.items.find(item => item.courseId === a.id)
        const itemB = wishlistStore.items.find(item => item.courseId === b.id)
        return (itemA?.addedAt || 0) - (itemB?.addedAt || 0)
      })
    case 'title':
      return courses.sort((a, b) => a.title.localeCompare(b.title))
    case 'price-low':
      return courses.sort((a, b) => a.price - b.price)
    case 'price-high':
      return courses.sort((a, b) => b.price - a.price)
    default:
      return courses
  }
})

const handleSort = (command) => {
  sortBy.value = command
  currentPage.value = 1
}

const handleToggleWishlist = (courseId) => {
  // 從願望清單 store 中移除（這樣會同步到彈窗）
  const success = wishlistStore.removeItem(courseId)

  if (success) {
    ElMessage.success('已從願望清單移除')

    // 如果當前頁沒有課程了，返回上一頁
    if (paginatedCourses.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToExplore = () => {
  router.push('/explore')
}

// 載入願望清單資料
onMounted(() => {
  wishlistStore.loadFromStorage()
})
</script>

<style scoped>
.wishlist-page {
  padding: 0;
}

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

.sort-button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.sort-button:hover {
  background: #45a049;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

:deep(.el-empty) {
  padding: 60px 0;
}

:deep(.el-button--primary) {
  background: #4CAF50;
  border-color: #4CAF50;
}

:deep(.el-button--primary:hover) {
  background: #45a049;
  border-color: #45a049;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #4CAF50;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
  color: #4CAF50;
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
