<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = Number(route.params.id);

const teachers = ref([
  { id: 1, name: "張老師", intro: "我喜歡教 Java 和 Vue。", avatar: "https://i.pravatar.cc/200?img=1" },
  { id: 2, name: "李老師", intro: "我專注於 Python 和資料分析。", avatar: "https://i.pravatar.cc/200?img=2" },
  { id: 3, name: "王老師", intro: "我喜歡前端開發，尤其是 Vue3。", avatar: "https://i.pravatar.cc/200?img=3" },
  { id: 4, name: "陳老師", intro: "我專注於後端與 Spring Boot。", avatar: "https://i.pravatar.cc/200?img=4" },
]);

// 只找「一位」老師
const teacher = computed(() =>
  teachers.value.find(t => t.id === id) || null
);
</script>

<template>
  <div class="teacher-detail">
    <div v-if="teacher" class="teacher-content">
      <el-avatar :size="200" :src="teacher.avatar" />
      <h1>老師：{{ teacher.name }}</h1>
      <p>ID：{{ teacher.id }}</p>
      <p>自我介紹：{{ teacher.intro }}</p>
    </div>

    <div v-else>
      <h2>找不到這位老師</h2>
    </div>
  </div>
</template>

<style scoped>
.teacher-detail {
  padding: 20px;
}

.teacher-content {
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--capy-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.4;
  /* 兩行省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.teacher-sub {
  font-size: 13px;
  color: var(--capy-primary);
  margin: 0 0 12px 0;
  font-weight: 500;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--capy-text-tertiary);
  border-top: 1px solid var(--capy-border-lighter);
  padding-top: 12px;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 20px;
  text-align: center;
  color: #999;
}

.empty-courses p {
  margin: 16px 0 0 0;
  font-size: 16px;
}

/* 課程網格 */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.course-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-card :deep(.el-card__body) {
  padding: 0;
}

.course-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #ccc;
  font-size: 40px;
}

.course-info {
  padding: 16px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 44px;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.review-count {
  color: #999;
}

.enrollment {
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 24px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #7ec8a3;
}

.publish-date {
  font-size: 12px;
  color: #999;
}

/* 分頁 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .teacher-detail-page {
    padding: 16px;
  }

  .teacher-header {
    flex-direction: column;
    text-align: center;
  }

  .teacher-name {
    font-size: 24px;
  }

  .teacher-stats {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .sort-select {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
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
