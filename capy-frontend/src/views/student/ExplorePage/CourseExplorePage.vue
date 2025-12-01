<template>
  <div class="explore-page">
    <!-- Main Container -->
    <el-container class="main-container">
      <!-- Desktop Filter Sidebar -->
      <el-aside v-show="!isMobile" width="300px" class="filter-sidebar">
        <el-card shadow="never" class="filter-card">
          <template #header>
            <div class="filter-header">
              <h3>Filters</h3>
            </div>
          </template>

          <!-- Category Section with Multi-Select Tree -->
          <div class="filter-section">
            <h4 class="section-title-student">Category (多選)</h4>
            <CategoryTreeMulti
              v-model="selectedCategories"
              :categories="categories"
              @filter-change="handleCategoryFilterChange"
            />
          </div>

          <!-- Ratings Section -->
          <div class="filter-section">
            <h4 class="section-title-student">Ratings</h4>
            <RatingOptions v-model="selectedRating" />
          </div>
        </el-card>
      </el-aside>

      <!-- Main Content -->
      <el-main class="main-content">
        <!-- Mobile Filter Button -->
        <div v-if="isMobile" class="mobile-filter-btn">
          <el-button
            type="primary"
            :icon="Filter"
            @click="drawerVisible = true"
            size="large"
          >
            Filters
          </el-button>
        </div>

        <!-- Breadcrumb -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item>All Courses</el-breadcrumb-item>
          <el-breadcrumb-item>
            {{ breadcrumbText }} ({{ filteredCourses.length }} Courses)
          </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Selected Tags -->
        <div v-if="selectedTags.length > 0" class="selected-tags">
          <el-tag
            v-for="tag in selectedTags"
            :key="tag"
            closable
            type="info"
            size="large"
            @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- Course Grid -->
        <el-row :gutter="24" class="course-grid">
          <el-col
            v-for="course in paginatedCourses"
            :key="course.id"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="8"
            :xl="6"
            class="course-col"
          >
            <ExploreCourseCard
              :course="course"
              @toggle-wishlist="toggleWishlist"
              @tag-click="handleTagClick"
            />
          </el-col>
        </el-row>

        <!-- Empty State -->
        <el-empty
          v-if="filteredCourses.length === 0"
          description="No courses found"
          :image-size="200"
        />

        <!-- Pagination -->
        <div v-if="filteredCourses.length > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredCourses.length"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>

    <!-- Mobile Filter Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="Filters"
      direction="ltr"
      size="80%"
    >
      <div class="drawer-content">
        <!-- Category Section -->
        <div class="filter-section">
          <h4 class="section-title-student">Category</h4>
          <CategoryRadioGroup v-model="selectedCategory" />
        </div>

        <!-- Ratings Section -->
        <div class="filter-section">
          <h4 class="section-title-student">Ratings</h4>
          <RatingOptions v-model="selectedRating" />
        </div>

        <!-- Apply Button -->
        <div class="drawer-footer">
          <el-button type="primary" size="large" @click="drawerVisible = false" class="apply-btn">
            Apply Filters
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter } from '@element-plus/icons-vue'
import ExploreHeader from '@/components/student/Explore/ExploreHeader.vue'
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import CategoryTreeMulti from '@/components/student/Explore/FilterDrawer/CategoryTreeMulti.vue'
import CategoryRadioGroup from '@/components/student/Explore/FilterDrawer/CategoryRadioGroup.vue'
import RatingOptions from '@/components/student/Explore/FilterDrawer/RatingOptions.vue'
import { exploreCourses, categories } from '@/mockData'
import { useWishlistStore } from '@/stores/wishlist'

// Stores
const wishlistStore = useWishlistStore()

// Responsive state
const isMobile = ref(false)
const drawerVisible = ref(false)

// Filter states
const selectedCategories = ref([])
const selectedRating = ref(0)
const selectedTags = ref([])
const searchQuery = ref('')

// 建立 category ID 到 name 的映射
const buildCategoryIdToNameMap = () => {
  const map = new Map()
  const traverse = (cats) => {
    cats.forEach(cat => {
      map.set(cat.id, cat.name)
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children)
      }
    })
  }
  traverse(categories)
  return map
}

const categoryIdToName = buildCategoryIdToNameMap()

// Pagination states
const currentPage = ref(1)
const pageSize = ref(8)

// 使用統一的課程資料，並轉換為元件需要的格式
// 同時檢查每個課程是否在願望清單中
const allCourses = computed(() => {
  return exploreCourses.map(course => ({
    id: course.id,
    title: course.title,
    cover: course.cover_image_url,
    teacher: course.instructor,
    rating: course.rating,
    ratingCount: course.reviewCount,
    category: course.category,
    tags: course.tags,
    price: course.price,
    originalPrice: course.originalPrice,
    isWishlisted: wishlistStore.hasItem(course.id) // 從 wishlist store 檢查
  }))
})

// Computed: Breadcrumb text
const breadcrumbText = computed(() => {
  if (selectedCategories.value.length === 0) {
    return 'All Categories'
  }

  const categoryNames = selectedCategories.value
    .map(id => categoryIdToName.get(id))
    .filter(Boolean)

  if (categoryNames.length === 0) {
    return 'All Categories'
  }

  if (categoryNames.length === 1) {
    return categoryNames[0]
  }

  // 多個分類時，顯示前兩個，其餘用數字表示
  if (categoryNames.length === 2) {
    return categoryNames.join(', ')
  }

  return `${categoryNames[0]}, ${categoryNames[1]} +${categoryNames.length - 2} more`
})

// Computed: Filtered courses
const filteredCourses = computed(() => {
  let courses = allCourses.value

  // Filter by categories (多選邏輯)
  if (selectedCategories.value.length > 0) {
    courses = courses.filter(course => {
      // 取得課程的分類名稱
      const selectedCategoryNames = selectedCategories.value
        .map(id => categoryIdToName.get(id))
        .filter(Boolean)

      // 檢查課程分類是否在選中的分類中
      return selectedCategoryNames.some(name =>
        course.category.includes(name) || name.includes(course.category)
      )
    })
  }

  // Filter by rating
  if (selectedRating.value > 0) {
    courses = courses.filter(course => course.rating >= selectedRating.value)
  }

  // Filter by tags
  if (selectedTags.value.length > 0) {
    courses = courses.filter(course =>
      selectedTags.value.some(tag => course.tags.includes(tag))
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    courses = courses.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.teacher.toLowerCase().includes(query) ||
      course.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return courses
})

// Computed: dPaginate courses
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCourses.value.slice(start, end)
})

// Methods
const handleCategoryFilterChange = (payload) => {
  // 當分類過濾變更時，可以在這裡處理 API 請求
  console.log('Category filter changed:', payload)
  currentPage.value = 1
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleTagClick = (tag) => {
  // 如果 tag 還沒被選中，則加入
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
    currentPage.value = 1
  }
}

const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
  currentPage.value = 1
}

const toggleWishlist = (courseId) => {
  const course = exploreCourses.find(c => c.id === courseId)
  if (!course) return

  // 檢查是否已在願望清單中
  if (wishlistStore.hasItem(courseId)) {
    // 從願望清單移除
    const success = wishlistStore.removeItem(courseId)
    if (success) {
      ElMessage.success('已從願望清單移除')
    }
  } else {
    // 加入願望清單
    const success = wishlistStore.addItem({
      id: courseId,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      cover_image_url: course.cover_image_url
    })
    if (success) {
      ElMessage.success('已加入願望清單')
    } else {
      ElMessage.warning('此課程已在願望清單中')
    }
  }
}

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Responsive handling
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // 載入願望清單資料
  wishlistStore.loadFromStorage()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.explore-page {
  min-height: 100vh;
  background: #FCF9F4;
}

.main-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0;
}

.filter-sidebar {
  background: transparent;
  padding: 24px 16px;
}

.filter-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.filter-card :deep(.el-card__header) {
  padding: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.filter-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.section-title-student {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

.main-content {
  padding: 32px 24px;
  background: transparent;
}

.mobile-filter-btn {
  margin-bottom: 20px;
}

.mobile-filter-btn .el-button {
  width: 100%;
  border-radius: 8px;
  background: #7ec8a3;
  border-color: #7ec8a3;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 15px;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #7ec8a3;
  font-weight: 600;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.course-grid {
  margin-bottom: 40px;
}

.course-col {
  margin-bottom: 24px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.pagination-wrapper :deep(.el-pagination) {
  gap: 8px;
}

.pagination-wrapper :deep(.el-pager li.is-active) {
  background: #7ec8a3;
  color: #fff;
}

.pagination-wrapper :deep(.el-pager li:hover) {
  color: #7ec8a3;
}

.drawer-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.apply-btn {
  width: 100%;
  background: #7ec8a3;
  border-color: #7ec8a3;
  border-radius: 8px;
  font-weight: 600;
}

.apply-btn:hover {
  background: #6bb890;
  border-color: #6bb890;
}

/* RWD */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }

  .breadcrumb {
    font-size: 14px;
  }

  .course-col {
    margin-bottom: 16px;
  }
}
</style>
