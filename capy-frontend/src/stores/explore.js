import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { searchCourses, getCategories, getTags, getSuggestions } from '@/api/student/explore'

/**
 * Explore Store - 管理課程探索頁面的資料和快取
 *
 * 功能：
 * 1. 快取分類樹資料（5分鐘有效期）
 * 2. 快取課程搜尋結果（3分鐘有效期）
 * 3. 快取標籤列表（5分鐘有效期）
 * 4. 提供關鍵字建議功能
 * 5. 提供並行載入方法
 */
export const useExploreStore = defineStore('explore', () => {
  // ==================== 狀態定義 ====================

  // 分類樹快取
  const categoriesCache = ref(null)
  const categoriesCacheTime = ref(0)
  const CATEGORIES_CACHE_DURATION = 5 * 60 * 1000 // 5 分鐘

  // 標籤列表快取
  const tagsCache = ref(null)
  const tagsCacheTime = ref(0)
  const TAGS_CACHE_DURATION = 5 * 60 * 1000 // 5 分鐘

  // 課程資料快取 (使用 Map 儲存不同篩選條件的結果)
  const coursesCache = ref(new Map())
  const COURSES_CACHE_DURATION = 3 * 60 * 1000 // 3 分鐘

  // 載入狀態
  const categoriesLoading = ref(false)
  const tagsLoading = ref(false)
  const coursesLoading = ref(false)

  // ==================== Computed ====================

  /**
   * 檢查分類樹快取是否有效
   */
  const isCategoriesCacheValid = computed(() => {
    if (!categoriesCache.value) return false
    const now = Date.now()
    return (now - categoriesCacheTime.value) < CATEGORIES_CACHE_DURATION
  })

  /**
   * 取得快取的分類樹
   */
  const cachedCategories = computed(() => {
    return isCategoriesCacheValid.value ? categoriesCache.value : null
  })

  /**
   * 檢查標籤列表快取是否有效
   */
  const isTagsCacheValid = computed(() => {
    if (!tagsCache.value) return false
    const now = Date.now()
    return (now - tagsCacheTime.value) < TAGS_CACHE_DURATION
  })

  /**
   * 取得快取的標籤列表
   */
  const cachedTags = computed(() => {
    return isTagsCacheValid.value ? tagsCache.value : null
  })

  // ==================== Actions ====================

  /**
   * 載入分類樹（帶快取）
   * @returns {Promise<Array>} 分類樹資料
   */
  const loadCategories = async () => {
    // 如果快取有效，直接返回
    if (isCategoriesCacheValid.value) {
      console.log('📦 使用快取的分類樹資料')
      return categoriesCache.value
    }

    categoriesLoading.value = true
    try {
      console.log('🌐 從 API 載入分類樹資料')
      const result = await getCategories()

      // 更新快取
      categoriesCache.value = result
      categoriesCacheTime.value = Date.now()

      console.log('✅ 分類樹載入成功，已快取')
      return result
    } catch (error) {
      console.error('❌ 載入分類樹失敗:', error)
      throw error
    } finally {
      categoriesLoading.value = false
    }
  }

  /**
   * 載入標籤列表（帶快取）
   * @returns {Promise<Array>} 標籤列表資料
   */
  const loadTags = async () => {
    // 如果快取有效，直接返回
    if (isTagsCacheValid.value) {
      console.log('📦 使用快取的標籤列表資料')
      return tagsCache.value
    }

    tagsLoading.value = true
    try {
      console.log('🌐 從 API 載入標籤列表資料')
      const result = await getTags()

      // 更新快取
      tagsCache.value = result
      tagsCacheTime.value = Date.now()

      console.log('✅ 標籤列表載入成功，已快取')
      return result
    } catch (error) {
      console.error('❌ 載入標籤列表失敗:', error)
      throw error
    } finally {
      tagsLoading.value = false
    }
  }

  /**
   * 取得關鍵字建議（不快取，即時查詢）
   * @param {string} keyword - 搜尋關鍵字
   * @param {number} size - 建議數量上限
   * @returns {Promise<Array<string>>} 關鍵字建議列表
   */
  const loadSuggestions = async (keyword, size = 15) => {
    if (!keyword || keyword.trim().length === 0) {
      return []
    }

    try {
      console.log('🔍 取得關鍵字建議:', keyword)
      const result = await getSuggestions({ keyword, size })
      console.log('✅ 關鍵字建議載入成功')
      return result
    } catch (error) {
      console.error('❌ 載入關鍵字建議失敗:', error)
      return []
    }
  }

  /**
   * 生成快取鍵值
   * @param {Object} params - 搜尋參數
   * @returns {string} 快取鍵值
   */
  const generateCacheKey = (params) => {
    // 將參數物件轉換為排序後的字串作為鍵值
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        const value = params[key]
        // 處理陣列參數
        if (Array.isArray(value)) {
          acc[key] = [...value].sort().join(',')
        } else {
          acc[key] = value
        }
        return acc
      }, {})

    return JSON.stringify(sortedParams)
  }

  /**
   * 檢查課程快取是否有效
   * @param {string} cacheKey - 快取鍵值
   * @returns {boolean} 是否有效
   */
  const isCoursesCacheValid = (cacheKey) => {
    const cached = coursesCache.value.get(cacheKey)
    if (!cached) return false

    const now = Date.now()
    return (now - cached.timestamp) < COURSES_CACHE_DURATION
  }

  /**
   * 載入課程資料（帶快取）
   * @param {Object} params - 搜尋參數
   * @returns {Promise<Object>} 課程資料
   */
  const loadCourses = async (params) => {
    const cacheKey = generateCacheKey(params)

    // 如果快取有效，直接返回
    if (isCoursesCacheValid(cacheKey)) {
      const cached = coursesCache.value.get(cacheKey)
      console.log('📦 使用快取的課程資料', params)
      return cached.data
    }

    coursesLoading.value = true
    try {
      console.log('🌐 從 API 載入課程資料', params)
      const result = await searchCourses(params)

      // 更新快取
      coursesCache.value.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })

      console.log('✅ 課程載入成功，已快取')
      return result
    } catch (error) {
      console.error('❌ 載入課程失敗:', error)
      throw error
    } finally {
      coursesLoading.value = false
    }
  }

  /**
   * 並行載入分類樹和課程資料
   * @param {Object} courseParams - 課程搜尋參數
   * @returns {Promise<Object>} { categories, courses }
   */
  const loadAllData = async (courseParams) => {
    console.log('🚀 開始並行載入資料...')
    const startTime = Date.now()

    try {
      // 並行執行兩個請求
      const [categories, courses] = await Promise.all([
        loadCategories(),
        loadCourses(courseParams)
      ])

      const duration = Date.now() - startTime
      console.log(`✅ 並行載入完成，耗時: ${duration}ms`)

      return { categories, courses }
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`❌ 並行載入失敗，耗時: ${duration}ms`, error)
      throw error
    }
  }

  /**
   * 清除所有快取
   */
  const clearCache = () => {
    console.log('🗑️ 清除所有快取')
    categoriesCache.value = null
    categoriesCacheTime.value = 0
    tagsCache.value = null
    tagsCacheTime.value = 0
    coursesCache.value.clear()
  }

  /**
   * 清除課程快取
   */
  const clearCoursesCache = () => {
    console.log('🗑️ 清除課程快取')
    coursesCache.value.clear()
  }

  /**
   * 清除分類樹快取
   */
  const clearCategoriesCache = () => {
    console.log('🗑️ 清除分類樹快取')
    categoriesCache.value = null
    categoriesCacheTime.value = 0
  }

  /**
   * 清除標籤列表快取
   */
  const clearTagsCache = () => {
    console.log('🗑️ 清除標籤列表快取')
    tagsCache.value = null
    tagsCacheTime.value = 0
  }

  /**
   * 取得快取統計資訊
   */
  const getCacheStats = computed(() => {
    return {
      categoriesCached: isCategoriesCacheValid.value,
      categoriesCacheAge: categoriesCacheTime.value
        ? Date.now() - categoriesCacheTime.value
        : 0,
      tagsCached: isTagsCacheValid.value,
      tagsCacheAge: tagsCacheTime.value
        ? Date.now() - tagsCacheTime.value
        : 0,
      courseCacheCount: coursesCache.value.size,
      courseCacheKeys: Array.from(coursesCache.value.keys())
    }
  })

  // ==================== 返回 ====================

  return {
    // State
    categoriesLoading,
    tagsLoading,
    coursesLoading,
    cachedCategories,
    cachedTags,

    // Actions
    loadCategories,
    loadTags,
    loadCourses,
    loadSuggestions,
    loadAllData,
    clearCache,
    clearCoursesCache,
    clearCategoriesCache,
    clearTagsCache,

    // Computed
    isCategoriesCacheValid,
    isTagsCacheValid,
    getCacheStats
  }
})
