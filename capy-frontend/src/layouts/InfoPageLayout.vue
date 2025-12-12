<template>
  <div class="info-page-layout">
    <el-container class="layout-container">
      <!-- 側邊欄導航 -->
      <el-aside width="280px" class="sidebar">
        <div class="sidebar-content">
          <h2 class="sidebar-title">幫助中心</h2>

          <nav class="nav-menu">
            <div class="nav-section">
              <h3 class="nav-section-title">支援服務</h3>
              <router-link
                to="/support"
                class="nav-item"
                :class="{ active: isActive('/support') }"
              >
                <el-icon><QuestionFilled /></el-icon>
                <span>客服中心</span>
              </router-link>
              <router-link
                to="/support/faq"
                class="nav-item"
                :class="{ active: isActive('/support/faq') }"
              >
                <el-icon><ChatDotRound /></el-icon>
                <span>常見問題</span>
              </router-link>
              <router-link
                to="/support/about"
                class="nav-item"
                :class="{ active: isActive('/support/about') }"
              >
                <el-icon><InfoFilled /></el-icon>
                <span>關於我們</span>
              </router-link>
            </div>

            <div class="nav-section">
              <h3 class="nav-section-title">法律條款</h3>
              <router-link
                to="/legal/terms"
                class="nav-item"
                :class="{ active: isActive('/legal/terms') }"
              >
                <el-icon><Document /></el-icon>
                <span>服務條款</span>
              </router-link>
              <router-link
                to="/legal/privacy"
                class="nav-item"
                :class="{ active: isActive('/legal/privacy') }"
              >
                <el-icon><Lock /></el-icon>
                <span>隱私權政策</span>
              </router-link>
              <router-link
                to="/legal/refund"
                class="nav-item"
                :class="{ active: isActive('/legal/refund') }"
              >
                <el-icon><Wallet /></el-icon>
                <span>退款政策</span>
              </router-link>
            </div>
          </nav>

          <!-- 聯絡資訊 -->
          <div class="contact-box">
            <el-icon class="contact-icon"><Service /></el-icon>
            <p class="contact-title">需要協助？</p>
            <p class="contact-text">聯絡客服團隊</p>
            <a href="mailto:support@capycourse.com" class="contact-link">
              support@capycourse.com
            </a>
          </div>
        </div>
      </el-aside>

      <!-- 主要內容區域 -->
      <el-main class="main-content">
        <div class="content-card">
          <slot></slot>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  QuestionFilled,
  ChatDotRound,
  InfoFilled,
  Document,
  Lock,
  Wallet,
  Service
} from '@element-plus/icons-vue'

const route = useRoute()

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.info-page-layout {
  min-height: 100vh;
  background-color: var(--capy-bg-base);
  padding: 40px 20px;
}

.layout-container {
  max-width: 1400px;
  margin: 0 auto;
  background-color: transparent;
}

/* 側邊欄樣式 */
.sidebar {
  background-color: transparent;
  padding-right: 24px;
}

.sidebar-content {
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 40px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--capy-bg-base);
}

/* 導航選單 */
.nav-menu {
  margin-bottom: 24px;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--capy-text-regular);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
  padding-left: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: var(--capy-text-regular);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: var(--capy-bg-base);
  color: var(--capy-primary);
}

.nav-item.active {
  background-color: rgba(84, 205, 242, 0.1);
  color: var(--capy-primary);
  font-weight: 500;
}

.nav-item .el-icon {
  font-size: 18px;
  flex-shrink: 0;
}

/* 聯絡資訊框 */
.contact-box {
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-primary-dark) 100%);
  border-radius: var(--capy-radius-lg);
  padding: 16px;
  text-align: center;
  color: white;
  margin-top: 20px;
}

.contact-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.contact-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.contact-text {
  font-size: 13px;
  margin: 0 0 10px 0;
  opacity: 0.9;
}

.contact-link {
  display: inline-block;
  color: white;
  text-decoration: none;
  font-size: 12px;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--capy-radius-round);
  transition: all 0.3s ease;
  word-break: break-all;
}

.contact-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 主要內容區域 */
.main-content {
  padding: 0;
}

.content-card {
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 600px;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .info-page-layout {
    padding: 20px 16px;
  }

  .layout-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100% !important;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .sidebar-content {
    position: static;
  }

  .content-card {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .sidebar-title {
    font-size: 20px;
  }

  .nav-item {
    font-size: 14px;
    padding: 10px;
  }

  .content-card {
    padding: 20px;
  }
}
</style>
