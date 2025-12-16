/**
 * 課程狀態判斷 Composable
 *
 * 用於判斷課程的狀態（已擁有、已下架、正常），並返回對應的 UI 狀態
 *
 * @module useCourseState
 */

/**
 * 判斷課程項目的狀態
 *
 * 優先權順序：
 * 1. 已擁有 (isEnrolled === true)
 * 2. 已下架 (status !== 'PUBLISHED')
 * 3. 正常 (可購買)
 *
 * @param {Object} item - 課程項目
 * @param {boolean} [item.isEnrolled] - 是否已購買此課程
 * @param {string} [item.status] - 課程狀態 ('PUBLISHED', 'FORCE_UNPUBLISHED', 'UNPUBLISHED')
 * @returns {Object} 課程狀態物件
 * @returns {string} return.type - 狀態類型 ('ENROLLED' | 'UNAVAILABLE' | 'NORMAL')
 * @returns {string} return.label - 顯示標籤
 * @returns {boolean} return.canBuy - 是否可以購買
 * @returns {boolean} return.disabled - 是否禁用
 * @returns {string} return.action - 建議的操作 ('GOTO_PLAYER' | 'NONE' | 'ADD_TO_CART')
 *
 * @example
 * // 已擁有的課程
 * const state = getItemState({ isEnrolled: true, status: 'PUBLISHED' })
 * // { type: 'ENROLLED', label: '已擁有', canBuy: false, disabled: true, action: 'GOTO_PLAYER' }
 *
 * @example
 * // 已下架的課程
 * const state = getItemState({ isEnrolled: false, status: 'UNPUBLISHED' })
 * // { type: 'UNAVAILABLE', label: '已下架', canBuy: false, disabled: true, action: 'NONE' }
 *
 * @example
 * // 正常可購買的課程
 * const state = getItemState({ isEnrolled: false, status: 'PUBLISHED' })
 * // { type: 'NORMAL', label: '加入購物車', canBuy: true, disabled: false, action: 'ADD_TO_CART' }
 */
export function getItemState(item) {
  // 優先權 1: 已擁有
  if (item.isEnrolled === true) {
    return {
      type: 'ENROLLED',
      label: '已擁有',
      canBuy: false,
      disabled: true,
      action: 'GOTO_PLAYER'
    }
  }

  // 優先權 2: 已下架
  // 只有 'PUBLISHED' 狀態代表上架中（不區分大小寫）
  if (item.status && item.status.toUpperCase() !== 'PUBLISHED') {
    return {
      type: 'UNAVAILABLE',
      label: '已下架',
      canBuy: false,
      disabled: true,
      action: 'NONE'
    }
  }

  // 優先權 3: 正常（可購買）
  return {
    type: 'NORMAL',
    label: '加入購物車',
    canBuy: true,
    disabled: false,
    action: 'ADD_TO_CART'
  }
}

/**
 * 批量判斷多個課程項目的狀態
 *
 * @param {Array<Object>} items - 課程項目陣列
 * @returns {Array<Object>} 包含原始項目和狀態的陣列
 *
 * @example
 * const items = [
 *   { id: 1, isEnrolled: true, status: 'PUBLISHED' },
 *   { id: 2, isEnrolled: false, status: 'UNPUBLISHED' }
 * ]
 * const itemsWithState = getItemsState(items)
 * // [
 * //   { id: 1, isEnrolled: true, status: 'PUBLISHED', state: { type: 'ENROLLED', ... } },
 * //   { id: 2, isEnrolled: false, status: 'UNPUBLISHED', state: { type: 'UNAVAILABLE', ... } }
 * // ]
 */
export function getItemsState(items) {
  return items.map(item => ({
    ...item,
    state: getItemState(item)
  }))
}

/**
 * 過濾出可購買的課程項目
 *
 * @param {Array<Object>} items - 課程項目陣列
 * @returns {Array<Object>} 可購買的課程項目陣列
 *
 * @example
 * const items = [
 *   { id: 1, isEnrolled: true, status: 'PUBLISHED' },
 *   { id: 2, isEnrolled: false, status: 'PUBLISHED' },
 *   { id: 3, isEnrolled: false, status: 'UNPUBLISHED' }
 * ]
 * const buyableItems = filterBuyableItems(items)
 * // [{ id: 2, isEnrolled: false, status: 'PUBLISHED' }]
 */
export function filterBuyableItems(items) {
  return items.filter(item => {
    const state = getItemState(item)
    return state.canBuy
  })
}

/**
 * 檢查課程是否可購買
 *
 * @param {Object} item - 課程項目
 * @returns {boolean} 是否可購買
 *
 * @example
 * const canBuy = isItemBuyable({ isEnrolled: false, status: 'PUBLISHED' })
 * // true
 */
export function isItemBuyable(item) {
  const state = getItemState(item)
  return state.canBuy
}

/**
 * 取得課程狀態的 Element Plus Tag 類型
 *
 * @param {Object} item - 課程項目
 * @returns {string} Element Plus Tag 類型 ('info' | 'danger' | '')
 *
 * @example
 * const tagType = getItemTagType({ isEnrolled: true })
 * // 'info'
 */
export function getItemTagType(item) {
  const state = getItemState(item)

  switch (state.type) {
    case 'ENROLLED':
      return 'info'
    case 'UNAVAILABLE':
      return 'danger'
    default:
      return ''
  }
}

/**
 * 取得課程狀態的按鈕類型
 *
 * @param {Object} item - 課程項目
 * @returns {string} 按鈕類型 ('success' | 'info' | 'primary')
 *
 * @example
 * const buttonType = getItemButtonType({ isEnrolled: true })
 * // 'success'
 */
export function getItemButtonType(item) {
  const state = getItemState(item)

  switch (state.type) {
    case 'ENROLLED':
      return 'success'
    case 'UNAVAILABLE':
      return 'info'
    default:
      return 'primary'
  }
}

/**
 * 取得課程狀態的按鈕文字
 *
 * @param {Object} item - 課程項目
 * @returns {string} 按鈕文字
 *
 * @example
 * const buttonText = getItemButtonText({ isEnrolled: true })
 * // '開始上課'
 */
export function getItemButtonText(item) {
  const state = getItemState(item)

  switch (state.type) {
    case 'ENROLLED':
      return '開始上課'
    case 'UNAVAILABLE':
      return '已下架'
    default:
      return '加入購物車'
  }
}

// 預設匯出
export default {
  getItemState,
  getItemsState,
  filterBuyableItems,
  isItemBuyable,
  getItemTagType,
  getItemButtonType,
  getItemButtonText
}
