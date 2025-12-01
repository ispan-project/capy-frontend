<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom"
    :width="300"
    trigger="click"
    popper-class="wishlist-popover"
  >
    <template #reference>
      <slot name="trigger">
        <el-button circle>
          <el-icon><Star /></el-icon>
        </el-button>
      </slot>
    </template>

    <!-- Popover 內容 -->
    <div class="wishlist-popover-content">
      <!-- 空願望清單狀態 -->
      <div v-if="wishlistStore.isEmpty" class="empty-wishlist">
        <div class="empty-icon">
          <el-icon :size="48" color="#C0C4CC">
            <Star />
          </el-icon>
        </div>
        <p class="empty-text">您的願望清單是空的</p>
      </div>

      <!-- 願望清單項目列表 -->
      <div v-else class="wishlist-content">
        <!-- 標題 -->
        <div class="wishlist-header">
          <h4>最近加入</h4>
        </div>

        <!-- 項目列表 -->
        <div class="wishlist-items">
          <div
            v-for="item in wishlistStore.recentItems"
            :key="item.courseId"
            class="wishlist-item"
          >
            <!-- 課程縮圖 -->
            <div class="item-thumbnail">
              <el-image
                :src="item.coverImageUrl"
                fit="cover"
                class="thumbnail-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>

            <!-- 課程資訊 -->
            <div class="item-info">
              <h5 class="item-title">{{ item.title }}</h5>
              <div class="item-price">{{ wishlistStore.formatPrice(item.price) }}</div>
            </div>

            <!-- 加入購物車按鈕 -->
            <div class="item-action">
              <el-button
                type="primary"
                :icon="ShoppingCart"
                circle
                size="small"
                @click="handleAddToCart(item.courseId)"
              />
            </div>
          </div>
        </div>

        <!-- 底部按鈕 -->
        <div class="wishlist-footer">
          <el-button
            type="primary"
            class="view-all-button"
            @click="handleViewAll"
          >
            前往我的願望清單
          </el-button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ShoppingCart, Picture } from '@element-plus/icons-vue'
import { useWishlistStore } from '@/stores/wishlist'

// ==================== Composables ====================

const router = useRouter()
const wishlistStore = useWishlistStore()

// ==================== State ====================

const visible = ref(false)

// ==================== Methods ====================

/**
 * 將項目加入購物車
 */
const handleAddToCart = (courseId) => {
  const success = wishlistStore.moveToCart(courseId)
  
  if (success) {
    ElMessage.success('已加入購物車')
  } else {
    ElMessage.warning('此課程已在購物車中')
  }
}

/**
 * 前往完整願望清單頁面
 */
const handleViewAll = () => {
  visible.value = false
  router.push({ name: 'Wishlist' })
}

/**
 * 關閉 Popover
 */
const closePopover = () => {
  visible.value = false
}

// ==================== Lifecycle ====================

// 載入願望清單資料
wishlistStore.loadFromStorage()
</script>

<style scoped>
/* ==================== Popover 內容 ==================== */

.wishlist-popover-content {
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

/* ==================== 空願望清單狀態 ==================== */

.empty-wishlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--capy-spacing-md);
}

.empty-text {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* ==================== 願望清單內容 ==================== */

.wishlist-content {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

/* 標題 */
.wishlist-header {
  padding: var(--capy-spacing-sm) 0;
  border-bottom: 1px solid var(--capy-border-lighter);
}

.wishlist-header h4 {
  margin: 0;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

/* 項目列表 */
.wishlist-items {
  max-height: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.wishlist-item {
  display: flex;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-sm);
  border-radius: var(--capy-radius-sm);
  transition: background-color var(--capy-transition-fast);
  cursor: pointer;
}

.wishlist-item:hover {
  background-color: var(--capy-bg-elevated);
}

/* 課程縮圖 */
.item-thumbnail {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--capy-radius-sm);
  overflow: hidden;
  background-color: var(--capy-bg-base);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--capy-bg-base);
  color: var(--capy-text-placeholder);
}

/* 課程資訊 */
.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.item-title {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
}

/* 操作按鈕 */
.item-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* 底部 */
.wishlist-footer {
  padding-top: var(--capy-spacing-sm);
  border-top: 1px solid var(--capy-border-lighter);
}

.view-all-button {
  width: 100%;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
}

/* ==================== 滾動條樣式 ==================== */

.wishlist-items::-webkit-scrollbar {
  width: 6px;
}

.wishlist-items::-webkit-scrollbar-track {
  background: var(--capy-bg-base);
  border-radius: 3px;
}

.wishlist-items::-webkit-scrollbar-thumb {
  background: var(--capy-border-base);
  border-radius: 3px;
}

.wishlist-items::-webkit-scrollbar-thumb:hover {
  background: var(--capy-text-placeholder);
}
</style>

<style>
/* ==================== Popover 全局樣式 ==================== */

.wishlist-popover.el-popper {
  padding: var(--capy-spacing-md) !important;
}
</style>