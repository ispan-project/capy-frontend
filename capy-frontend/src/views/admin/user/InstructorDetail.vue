<script setup>
import {
  User,
  Message,
  Clock,
  Briefcase,
  Document,
  Download,
  ArrowLeft,
  Close,
  Check,
  Link,
} from "@element-plus/icons-vue";

const instructor = {
  id: "INS-2033",
  name: "王小敏",
  email: "instructor@example.com",
  nickname: "UX_Minx",
  status: "審核中",
  appliedAt: "2025-12-03",
  applicationTimes: 2,
};

const workExperiences = [
  { company: "星辰互動", title: "資深 UX 設計師", period: "2023/02 - 2025/11" },
  { company: "山海數位", title: "產品設計師", period: "2020/08 - 2023/01" },
];

const certificates = [
  { id: 1, name: "Google UX Certificate.pdf", size: "1.2 MB", type: "pdf" },
  { id: 2, name: "Figma Advanced Workshop.pdf", size: "860 KB", type: "pdf" },
  { id: 3, name: "作品集連結", size: "link", type: "link" },
];

const handleDownload = (item) => {
  // TODO: 串接後端下載
  console.log("download", item.name);
};
</script>

<template>
  <div class="instructor-detail">
    <div class="section-heading">講師申請詳情</div>

    <!-- 基本資料卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <el-avatar :size="64" class="avatar">
            {{ instructor.name.charAt(0) }}
          </el-avatar>
          <div class="profile-basic">
            <h2 class="profile-name">{{ instructor.name }}</h2>
            <span class="profile-id">{{ instructor.id }}</span>
          </div>
        </div>
        <el-tag :type="instructor.status === '審核中' ? 'warning' : 'success'" size="large" round>
          {{ instructor.status }}
        </el-tag>
      </div>

      <el-divider />

      <el-descriptions :column="2" border>
        <el-descriptions-item>
          <template #label>
            <div class="desc-label">
              <el-icon><Message /></el-icon>
              <span>Email</span>
            </div>
          </template>
          {{ instructor.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="desc-label">
              <el-icon><User /></el-icon>
              <span>暱稱</span>
            </div>
          </template>
          {{ instructor.nickname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="desc-label">
              <el-icon><Clock /></el-icon>
              <span>提交時間</span>
            </div>
          </template>
          {{ instructor.appliedAt }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="desc-label">
              <el-icon><Document /></el-icon>
              <span>申請次數</span>
            </div>
          </template>
          <div class="application-times">
            <span>{{ instructor.applicationTimes }} 次</span>
            <el-button v-if="instructor.applicationTimes > 1" link type="primary" size="small">
              查看歷次紀錄
            </el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 工作經歷 -->
    <div class="section-card">
      <div class="section-header">
        <el-icon class="section-icon"><Briefcase /></el-icon>
        <h3 class="section-title">工作經歷</h3>
      </div>

      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in workExperiences"
          :key="item.company"
          :type="index === 0 ? 'primary' : 'info'"
          :hollow="index !== 0"
        >
          <div class="timeline-card">
            <div class="timeline-top">
              <h4 class="company-name">{{ item.company }}</h4>
              <el-tag size="small" type="info" effect="plain">{{ item.period }}</el-tag>
            </div>
            <p class="job-title">{{ item.title }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 憑證文件 -->
    <div class="section-card">
      <div class="section-header">
        <el-icon class="section-icon"><Document /></el-icon>
        <h3 class="section-title">憑證 / 證明文件</h3>
      </div>

      <div class="file-list">
        <div
          v-for="item in certificates"
          :key="item.id"
          class="file-item"
          :class="{ 'file-link': item.type === 'link' }"
        >
          <div class="file-icon">
            <el-icon v-if="item.type === 'pdf'" :size="20"><Document /></el-icon>
            <el-icon v-else :size="20"><Link /></el-icon>
          </div>
          <div class="file-info">
            <span class="file-name">{{ item.name }}</span>
            <span class="file-size">{{ item.size }}</span>
          </div>
          <el-button
            type="primary"
            :icon="Download"
            circle
            size="small"
            @click="handleDownload(item)"
          />
        </div>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="action-bar">
      <el-button size="large" :icon="ArrowLeft">返回列表</el-button>
      <div class="action-main">
        <el-button type="danger" size="large" :icon="Close">審核不通過</el-button>
        <el-button type="primary" size="large" :icon="Check">審核通過</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instructor-detail {
  max-width: 900px;
}

/* 基本資料卡片 */
.profile-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  margin-bottom: var(--capy-spacing-lg);
  border: 1px solid var(--capy-border-lighter);
  box-shadow: var(--capy-shadow-sm);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.avatar {
  background: var(--capy-primary);
  color: var(--capy-text-inverse);
  font-size: 24px;
  font-weight: var(--capy-font-weight-bold);
}

.profile-basic {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0;
}

.profile-id {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.desc-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--capy-text-regular);
}

.desc-label .el-icon {
  color: var(--capy-primary);
}

.application-times {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 區塊卡片 */
.section-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  margin-bottom: var(--capy-spacing-lg);
  border: 1px solid var(--capy-border-lighter);
  box-shadow: var(--capy-shadow-sm);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--capy-spacing-lg);
  padding-bottom: var(--capy-spacing-md);
  border-bottom: 1px solid var(--capy-border-lighter);
}

.section-icon {
  font-size: 20px;
  color: var(--capy-primary);
}

.section-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
}

/* 時間線 */
.timeline-card {
  padding: var(--capy-spacing-sm) 0;
}

.timeline-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.company-name {
  font-size: var(--capy-font-size-md);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
}

.job-title {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* 文件列表 */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md);
  background: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-lighter);
  transition: all var(--capy-transition-base);
}

.file-item:hover {
  border-color: var(--capy-primary);
  box-shadow: var(--capy-shadow-sm);
}

.file-item.file-link {
  border-style: dashed;
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--capy-radius-base);
  background: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--capy-primary);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  word-break: break-all;
}

.file-size {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
}

/* 操作按鈕 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-lighter);
  flex-wrap: wrap;
  gap: var(--capy-spacing-md);
}

.action-main {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 響應式 */
@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--capy-spacing-md);
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-main {
    justify-content: center;
  }

  :deep(.el-descriptions) {
    --el-descriptions-item-bordered-label-background: var(--capy-bg-base);
  }
}

/* Element Plus 覆寫 */
:deep(.el-descriptions) {
  --el-descriptions-item-bordered-label-background: var(--capy-bg-base);
}

:deep(.el-divider) {
  margin: var(--capy-spacing-md) 0;
}

:deep(.el-timeline) {
  padding-left: 4px;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 20px;
}
</style>
