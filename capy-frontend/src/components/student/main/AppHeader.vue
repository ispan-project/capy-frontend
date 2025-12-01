<template>
  <el-header class="header" :class="{ 'header-minimal': isApplicationPage }">
    <div class="header-content">
      <router-link to="/" class="logo">
        <el-icon :size="24" color="#fff"><Reading /></el-icon>
        <span class="logo-text">CopyCourse</span>
      </router-link>

      <!-- 只在非申請頁面顯示 Explore 按鈕 -->
      <div v-if="!isApplicationPage" class="explore">
        <router-link to="/explore">
          <el-button type="success" plain>explore</el-button>
        </router-link>
      </div>

      <!-- 只在非申請頁面顯示搜尋框 -->
      <div v-if="!isApplicationPage" class="header-center">
        <el-input
          v-model="searchText"
          placeholder="Search..."
          :prefix-icon="Search"
          class="search-input"
          size="large"
        />
      </div>

      <!-- 在申請頁面時顯示佔位元素，保持 Logo 和使用者選單的間距 -->
      <div v-if="isApplicationPage" class="header-spacer"></div>

      <div class="header-actions">
        <!-- 只在非申請頁面顯示 Become a Teacher 按鈕 -->
        <router-link v-if="!isApplicationPage" to="/instructor/landing">
          <el-button type="success" plain>Become a Teacher</el-button>
        </router-link>
        <!-- 未登入時顯示登入按鈕 -->
        <template v-if="!userStore.isAuthenticated">
          <router-link to="/login">
            <el-button type="warning">Log In</el-button>
          </router-link>
        </template>

        <!-- 已登入時顯示使用者資訊和登出按鈕 -->
        <template v-else>
          <!-- 只在非申請頁面顯示購物車、收藏、通知按鈕 -->
          <template v-if="!isApplicationPage">
            <el-badge :value="cartStore.itemCount" :hidden="cartStore.isEmpty" class="cart-badge">
              <el-button circle @click="handleCart">
                <el-icon><ShoppingCart /></el-icon>
              </el-button>
            </el-badge>
            <el-badge :value="wishlistStore.itemCount" :hidden="wishlistStore.isEmpty" class="wishlist-badge">
              <TheWishlistPopover>
                <template #trigger>
                  <el-button circle>
                    <el-icon><Star /></el-icon>
                  </el-button>
                </template>
              </TheWishlistPopover>
            </el-badge>
            <el-badge :value="notificationStore.unreadCount" :hidden="notificationStore.unreadCount === 0" class="notification-badge">
              <TheNotificationPopover>
                <template #trigger>
                  <el-button circle>
                    <el-icon><Bell /></el-icon>
                  </el-button>
                </template>
              </TheNotificationPopover>
            </el-badge>
          </template>

          <TheUserDropdown />
        </template>
      </div>
    </div>

    <!-- 購物車抽屜 -->
    <TheCartDrawer v-model="showCartDrawer" />
  </el-header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Reading, ShoppingCart, Star, Bell } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotificationStore } from '@/stores/notification'
import TheCartDrawer from '@/components/student/cart/TheCartDrawer.vue'
import TheWishlistPopover from '@/components/student/wishlist/TheWishlistPopover.vue'
import TheNotificationPopover from '@/components/student/notifications/TheNotificationPopover.vue'
import TheUserDropdown from '@/components/student/main/TheUserDropdown.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()
const searchText = ref('')
const showCartDrawer = ref(false)

// ==================== 初始化模擬資料 ====================

/**
 * 初始化購物車模擬資料（僅用於測試）
 */
const initMockCartData = () => {
  // 如果購物車已有資料，不重複初始化
  if (cartStore.itemCount > 0) {
    return
  }

  // 模擬課程資料
  const mockCourses = [
    {
      id: 1,
      title: 'Vue 3 完整開發指南：從入門到精通',
      instructor: '張小明',
      price: 1200,
      cover_image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
    },
    {
      id: 2,
      title: 'TypeScript 實戰開發：打造型別安全的應用程式',
      instructor: '李美華',
      price: 1500,
      cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
    },
    {
      id: 3,
      title: 'Pinia 狀態管理完全攻略',
      instructor: '王大偉',
      price: 800,
      cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
    }
  ]

  // 將模擬課程加入購物車
  mockCourses.forEach(course => {
    cartStore.addItem(course)
  })

  console.log('✅ 已載入模擬購物車資料')
}

// 元件掛載時初始化
onMounted(() => {
  // 先從 localStorage 載入
  cartStore.loadFromStorage()

  // 如果沒有資料，則載入模擬資料
  if (cartStore.isEmpty) {
    initMockCartData()
  }

  // 載入願望清單資料
  wishlistStore.loadFromStorage()

  // 如果願望清單為空，載入模擬資料
  if (wishlistStore.isEmpty) {
    initMockWishlistData()
  }

  // 載入通知資料
  notificationStore.fetchNotifications()
})

/**
 * 初始化願望清單模擬資料（僅用於測試）
 */
const initMockWishlistData = () => {
  const mockWishlistCourses = [
    {
      id: 4,
      title: 'React 18 完整開發指南',
      instructor: '陳小華',
      price: 1800,
      cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: 5,
      title: 'Node.js 後端開發實戰',
      instructor: '林大明',
      price: 2000,
      cover_image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'
    },
    {
      id: 6,
      title: 'MongoDB 資料庫設計與優化',
      instructor: '黃小美',
      price: 1500,
      cover_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400'
    }
  ]

  mockWishlistCourses.forEach(course => {
    wishlistStore.addItem(course)
  })

  console.log('✅ 已載入模擬願望清單資料')
}

/**
 * 檢查是否在申請表單頁面
 * 在此頁面時，只顯示 Logo 和使用者選單
 */
const isApplicationPage = computed(() => {
  return route.name === 'becomeInstructor'
})

/**
 * 處理購物車點擊
 */
const handleCart = () => {
  showCartDrawer.value = true
}

/**
 * 處理通知點擊
 */
const handleNotifications = () => {
  router.push({ name: 'Notifications' })
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-brand) 100%);
  padding: 0;
  height: 70px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.logo-text {
  white-space: nowrap;
}

.header-center {
  flex: 1;
  max-width: 500px;
}

.header-spacer {
  flex: 1;
}

/* 申請頁面的簡化樣式 */
.header-minimal .header-content {
  justify-content: space-between;
}

.search-input {
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-center {
    order: 3;
    width: 100%;
    max-width: 100%;
  }
}
</style>
