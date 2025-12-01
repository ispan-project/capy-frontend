import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 購物車項目介面
 */
interface CartItem {
  courseId: number
  title: string
  instructor: string
  price: number
  coverImageUrl: string
}

/**
 * 購物車 Store
 * 管理購物車狀態、項目和操作
 */
export const useCartStore = defineStore('cart', () => {
  // ==================== State ====================
  
  /**
   * 購物車項目列表
   */
  const items = ref<CartItem[]>([])

  // ==================== Getters ====================
  
  /**
   * 購物車項目數量
   */
  const itemCount = computed(() => items.value.length)

  /**
   * 購物車總價（TWD）
   */
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price, 0)
  })

  /**
   * 格式化的總價字串（NT$ X,XXX）
   */
  const formattedTotalPrice = computed(() => {
    return `NT$ ${totalPrice.value.toLocaleString('zh-TW')}`
  })

  /**
   * 購物車是否為空
   */
  const isEmpty = computed(() => items.value.length === 0)

  // ==================== Actions ====================
  
  /**
   * 新增課程到購物車
   * @param course 課程資訊
   */
  const addItem = (course: {
    id: number
    title: string
    instructor: string
    price: number
    cover_image_url: string
  }) => {
    // 檢查課程是否已在購物車中
    const existingItem = items.value.find(item => item.courseId === course.id)
    
    if (existingItem) {
      console.warn('課程已在購物車中')
      return false
    }

    // 新增到購物車
    items.value.push({
      courseId: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      coverImageUrl: course.cover_image_url
    })

    return true
  }

  /**
   * 從購物車移除課程
   * @param courseId 課程 ID
   */
  const removeItem = (courseId: number) => {
    const index = items.value.findIndex(item => item.courseId === courseId)
    
    if (index !== -1) {
      items.value.splice(index, 1)
      return true
    }

    return false
  }

  /**
   * 清空購物車
   */
  const clearCart = () => {
    items.value = []
  }

  /**
   * 檢查課程是否在購物車中
   * @param courseId 課程 ID
   */
  const hasItem = (courseId: number) => {
    return items.value.some(item => item.courseId === courseId)
  }

  /**
   * 格式化價格（TWD）
   * @param price 價格
   */
  const formatPrice = (price: number) => {
    return `NT$ ${price.toLocaleString('zh-TW')}`
  }

  // ==================== Persistence ====================
  
  /**
   * 從 localStorage 載入購物車
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('載入購物車失敗:', error)
    }
  }

  /**
   * 儲存購物車到 localStorage
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('儲存購物車失敗:', error)
    }
  }

  // 監聽購物車變化並自動儲存
  // 注意：在實際使用時，可以在元件中使用 watch 來觸發儲存

  return {
    // State
    items,
    
    // Getters
    itemCount,
    totalPrice,
    formattedTotalPrice,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    clearCart,
    hasItem,
    formatPrice,
    loadFromStorage,
    saveToStorage
  }
})