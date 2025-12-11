<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchTeacherDetail } from '@/api/student/teacherDetail';
import { useWishlistStore } from '@/stores/wishlist';
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue';
import { User, Reading } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const wishlistStore = useWishlistStore();

const teacher = ref(null);
const currentPage = ref(1);
const pageSize = 12;

const instructorId = computed(() => Number(route.params.id) || null);

// 格式化數字
const formatCount = count => {
  if (!count) return '0';
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();
};

// 取得老師資料
const fetchTeacher = async (id, page = 0) => {
  if (!id) return;
  try {
    teacher.value = await fetchTeacherDetail(id, {
      page,
      size: pageSize,
      sort: 'popular'
    });
  } catch (err) {
    console.error('取得老師資料失敗', err);
  }
};

// 分頁切換
const handlePageChange = page => {
  currentPage.value = page;
  fetchTeacher(instructorId.value, page - 1);
  document.querySelector('.courses-section')?.scrollIntoView({ behavior: 'smooth' });
};

// 處理願望清單切換
const handleToggleWishlist = async (courseId) => {
  const course = teacher.value?.courses?.content?.find(c => c.id === courseId);
  if (!course) return;

  try {
    // 檢查是否已在願望清單中
    if (wishlistStore.hasItem(courseId)) {
      // 從願望清單移除（會呼叫後端 API）
      await wishlistStore.removeItem(courseId);
    } else {
      // 加入願望清單（會呼叫後端 API）
      await wishlistStore.addItem({
        id: courseId,
        title: course.title,
        instructor: course.instructorName,
        price: course.price,
        cover_image_url: course.coverImageUrl
      });
    }
  } catch (error) {
    console.error('切換願望清單失敗', error);
  }
};

// 處理標籤點擊
const handleTagClick = (tag) => {
  router.push({ name: 'explore', query: { tag } });
};

// 初始化和路由監聽
onMounted(() => fetchTeacher(instructorId.value, 0));

watch(() => route.params.id, (newId) => {
  const id = Number(newId);
  if (!isNaN(id)) {
    currentPage.value = 1;
    fetchTeacher(id, 0);
  }
});
</script>

<template>
  <div class="main-content">
    <!-- 老師個人資訊 -->
    <div v-if="teacher" class="teacher-profile-card">
      <div class="profile-left">
        <div class="avatar-wrapper">
          <div class="avatar-ring"></div>
          <el-avatar :size="160" :src="teacher.avatarUrl" class="teacher-avatar" />
        </div>
      </div>

      <div class="profile-right">
        <div class="profile-header">
          <h1 class="teacher-name">{{ teacher.instructorName }}</h1>
        </div>
        <p class="teacher-bio">{{ teacher.bio }}</p>

        <div class="teacher-stats">
          <div class="stat-item">
            <div class="stat-icon-wrapper">
              <el-icon class="stat-icon"><User /></el-icon>
            </div>
            <div class="stat-text">
              <span class="stat-value">{{ formatCount(teacher.totalStudents) }}</span>
              <span class="stat-label">學員總數</span>
            </div>
          </div>

          <div class="stat-divider"></div>

          <div class="stat-item">
            <div class="stat-icon-wrapper">
              <el-icon class="stat-icon"><Reading /></el-icon>
            </div>
            <div class="stat-text">
              <span class="stat-value">{{ teacher.totalCourses }}</span>
              <span class="stat-label">開設課程</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 課程列表 -->
    <div v-if="teacher?.courses" class="courses-section">
      <h2 class="section-title-student">
        該老師的課程
      </h2>

      <el-row :gutter="24" class="course-grid">
        <el-col
          v-for="course in teacher.courses.content"
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
            @toggle-wishlist="handleToggleWishlist"
            @tag-click="handleTagClick"
          />
        </el-col>
      </el-row>

      <!-- 分頁 -->
      <div v-if="teacher.courses.totalElements > pageSize" class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="teacher.courses.totalElements"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>


<style scoped>
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* =========================================
   1. Teacher Profile Card (詳情頁大卡片)
   ========================================= */
.teacher-profile-card {
  display: flex;
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: 40px;
  box-shadow: var(--capy-shadow-md);
  margin-bottom: 60px;
  gap: 60px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 裝飾背景圓 (選用) */
.teacher-profile-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: var(--capy-primary-light);
  border-radius: 50%;
  opacity: 0.5;
  z-index: 0;
}

.profile-left {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.profile-right {
  flex: 1;
  text-align: left;
  position: relative;
  z-index: 1;
}

/* Avatar Ring Effect */
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid var(--capy-primary);
  opacity: 0.3;
  animation: pulse-ring 3s infinite;
}

@keyframes pulse-ring {
  0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.2; }
  100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
}

.teacher-avatar {
  border: 4px solid var(--capy-bg-surface);
  box-shadow: var(--capy-shadow-sm);
  position: relative;
  z-index: 2;
}

/* Profile Texts */
.profile-header {
  margin-bottom: 16px;
  border-bottom: 2px solid var(--capy-border-lighter);
  padding-bottom: 16px;
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.teacher-name {
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  color: var(--capy-text-primary);
  letter-spacing: -0.5px;
}


.teacher-bio {
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-secondary);
  margin-bottom: 30px;
  max-width: 800px;
}

/* Stats Row */
.teacher-stats {
  display: flex;
  align-items: center;
  gap: 40px;
  background: #f8fafc;
  padding: 20px 30px;
  border-radius: var(--capy-radius-md);
  width: fit-content;
  border: 1px solid var(--capy-border-light);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  background: var(--capy-bg-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.stat-icon {
  font-size: 20px;
  color: var(--capy-primary);
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--capy-text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--capy-text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--capy-border-light);
}

/* RWD for Profile */
@media (max-width: 768px) {
  .teacher-profile-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
    gap: 30px;
  }
  .profile-right { text-align: center; }
  .profile-header { justify-content: center; }
  .teacher-stats {
    width: 100%;
    justify-content: space-around;
    padding: 15px;
    gap: 10px;
  }
  .stat-item { flex-direction: column; gap: 6px; }
  .stat-divider { display: none; }
  .stat-icon-wrapper { margin-bottom: 4px; }
}

/* =========================================
   2. Course Grid (課程列表)
   ========================================= */
.courses-section { margin-bottom: 60px; }

.section-title-student {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--capy-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}


.course-grid {
  margin-bottom: 40px;
}

.course-col {
  margin-bottom: 24px;
}

/* =========================================
   3. Pagination (Capy Style)
   ========================================= */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  text-align: center;
}

:deep(.el-pagination) {
  justify-content: center;
  gap: 8px;
  --el-pagination-button-bg-color: var(--capy-bg-surface);
  --el-pagination-hover-color: var(--capy-primary);
}

:deep(.el-pagination .el-pager li) {
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: var(--capy-primary) !important;
  color: #fff !important;
  box-shadow: 0 4px 10px rgba(0, 191, 165, 0.3);
}

:deep(.el-pagination button) {
  border-radius: 8px;
}
</style>
