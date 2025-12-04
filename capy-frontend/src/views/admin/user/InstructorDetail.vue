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
          <div class="avatar">
            <span class="avatar-text">{{ instructor.name.charAt(0) }}</span>
          </div>
          <div class="profile-basic">
            <h2 class="profile-name">{{ instructor.name }}</h2>
            <span class="profile-id">{{ instructor.id }}</span>
          </div>
        </div>
        <el-tag
          :type="instructor.status === '審核中' ? 'warning' : 'success'"
          effect="light"
          size="large"
          round
        >
          {{ instructor.status }}
        </el-tag>
      </div>

      <div class="profile-info-grid">
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Message /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">Email</span>
            <span class="info-value">{{ instructor.email }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">暱稱</span>
            <span class="info-value">{{ instructor.nickname }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">提交時間</span>
            <span class="info-value">{{ instructor.appliedAt }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon warning">
            <el-icon><Document /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">申請次數</span>
            <span class="info-value">
              {{ instructor.applicationTimes }} 次
              <el-button v-if="instructor.applicationTimes > 1" link type="primary" size="small">
                查看歷次紀錄
              </el-button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 工作經歷 -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><Briefcase /></el-icon>
        </div>
        <h3 class="section-title">工作經歷</h3>
      </div>
      <div class="timeline">
        <div v-for="(item, index) in workExperiences" :key="item.company" class="timeline-item">
          <div class="timeline-dot" :class="{ active: index === 0 }"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h4 class="company-name">{{ item.company }}</h4>
              <span class="period-badge">{{ item.period }}</span>
            </div>
            <p class="job-title">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 憑證文件 -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="section-title">憑證 / 證明文件</h3>
      </div>
      <div class="file-grid">
        <div
          v-for="item in certificates"
          :key="item.id"
          class="file-card"
          :class="{ 'file-link': item.type === 'link' }"
        >
          <div class="file-icon">
            <el-icon v-if="item.type === 'pdf'" size="24"><Document /></el-icon>
            <el-icon v-else size="24"><Link /></el-icon>
          </div>
          <div class="file-info">
            <p class="file-name">{{ item.name }}</p>
            <p class="file-size">{{ item.size }}</p>
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
      <el-button size="large" :icon="ArrowLeft"> 返回列表 </el-button>
      <div class="action-main">
        <el-button type="danger" size="large" :icon="Close"> 審核不通過 </el-button>
        <el-button type="primary" size="large" :icon="Check"> 審核通過 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instructor-detail {
  max-width: 900px;
}

/* 基本資料卡片 - 使用主題色 */
.profile-card {
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-brand) 100%);
  border-radius: var(--capy-radius-xl);
  padding: 28px 32px;
  margin-bottom: var(--capy-spacing-lg);
  color: var(--capy-text-inverse);
  box-shadow: 0 10px 40px rgba(var(--capy-primary-rgb), 0.3);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--capy-radius-circle);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-text {
  font-size: 28px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-inverse);
}

.profile-basic {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: var(--capy-font-size-title);
  font-weight: var(--capy-font-weight-bold);
  margin: 0;
}

.profile-id {
  font-size: var(--capy-font-size-base);
  opacity: 0.85;
  font-weight: var(--capy-font-weight-medium);
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 14px 16px;
  border-radius: var(--capy-radius-lg);
  transition: background var(--capy-transition-base);
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.22);
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--capy-radius-md);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon.warning {
  background: rgba(var(--capy-warning), 0.3);
}

.info-icon .el-icon {
  font-size: 18px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-content .info-label {
  font-size: var(--capy-font-size-xs);
  opacity: 0.8;
  font-weight: var(--capy-font-weight-medium);
}

.info-content .info-value {
  font-size: var(--capy-font-size-md);
  font-weight: var(--capy-font-weight-semibold);
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* 區塊卡片 */
.section-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-xl);
  padding: var(--capy-spacing-lg) 28px;
  margin-bottom: var(--capy-spacing-lg);
  box-shadow: var(--capy-shadow-base);
  border: 1px solid var(--capy-border-lighter);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: var(--capy-spacing-md);
  border-bottom: 1px solid var(--capy-border-lighter);
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--capy-radius-md);
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-brand) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--capy-text-inverse);
}

.section-icon .el-icon {
  font-size: 20px;
}

.section-card .section-title {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0;
}

/* 時間線 */
.timeline {
  padding-left: 8px;
}

.timeline-item {
  display: flex;
  gap: 20px;
  position: relative;
  padding-bottom: var(--capy-spacing-lg);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item:not(:last-child)::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: var(--capy-border-light);
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: var(--capy-radius-circle);
  background: var(--capy-border-light);
  border: 3px solid var(--capy-bg-surface);
  box-shadow: 0 0 0 2px var(--capy-border-light);
  flex-shrink: 0;
  margin-top: 4px;
  z-index: 1;
}

.timeline-dot.active {
  background: var(--capy-primary);
  box-shadow: 0 0 0 2px var(--capy-primary);
}

.timeline-content {
  flex: 1;
  background: var(--capy-bg-base);
  padding: var(--capy-spacing-md) 20px;
  border-radius: var(--capy-radius-lg);
  border: 1px solid var(--capy-border-lighter);
  transition: all var(--capy-transition-base);
}

.timeline-content:hover {
  border-color: var(--capy-primary);
  box-shadow: 0 4px 12px rgba(var(--capy-primary-rgb), 0.1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.company-name {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0;
}

.period-badge {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-primary);
  background: rgba(var(--capy-primary-rgb), 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: var(--capy-font-weight-semibold);
}

.job-title {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-regular);
  margin: 0;
}

/* 文件網格 */
.file-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md) 20px;
  background: var(--capy-bg-base);
  border-radius: var(--capy-radius-lg);
  border: 1px solid var(--capy-border-lighter);
  transition: all var(--capy-transition-base);
}

.file-card:hover {
  border-color: var(--capy-primary);
  background: var(--el-color-primary-light-9);
  box-shadow: 0 4px 12px rgba(var(--capy-primary-rgb), 0.08);
}

.file-card.file-link {
  border-style: dashed;
}

.file-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--capy-radius-md);
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-brand) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--capy-text-inverse);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-info .file-name {
  font-size: var(--capy-font-size-md);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0 0 4px 0;
  word-break: break-all;
}

.file-info .file-size {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* 操作按鈕 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg) 0;
  margin-top: 8px;
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
  .profile-info-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    gap: var(--capy-spacing-md);
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-main {
    justify-content: center;
  }
}
</style>
