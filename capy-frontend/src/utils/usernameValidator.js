/**
 * 計算混合長度（中英文混合）
 * - ASCII 字元（英數）算 1 單位
 * - 非 ASCII 字元（中文等）算 2 單位
 * @param {string} str - 要計算的字串
 * @returns {number} 總長度單位
 */
export function mixedLength(str) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode <= 0x007f) {
      length += 1; // ASCII 字元
    } else {
      length += 2; // 非 ASCII 字元（中文等）
    }
  }
  return length;
}

/**
 * Debounce 函式：延遲執行函式，避免頻繁觸發
 * @param {Function} fn - 要延遲執行的函式
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Function} 包裝後的函式
 */
export function debounce(fn, delay) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 已存在的使用者名稱列表（前端模擬）
 */
export const takenUsernames = ['admin', 'test', 'user01', '小明', 'test123', '管理員', 'demo'];

/**
 * 檢查使用者名稱是否已被使用
 * @param {string} username - 要檢查的使用者名稱
 * @returns {boolean} 是否已被使用
 */
export function isUsernameTaken(username) {
  const trimmedUsername = username.trim().toLowerCase();
  return takenUsernames.some(taken => taken.toLowerCase() === trimmedUsername);
}

/**
 * 驗證使用者名稱
 * @param {string} username - 要驗證的使用者名稱
 * @returns {Object} 驗證結果 { valid: boolean, message: string, type: 'success'|'error'|'warning' }
 */
export function validateUsername(username) {
  // 去除前後空白
  const trimmedUsername = username.trim();
  
  // 檢查是否為空
  if (!trimmedUsername) {
    return {
      valid: false,
      message: '',
      type: 'error'
    };
  }
  
  // 檢查長度規則
  const length = mixedLength(trimmedUsername);
  if (length < 4) {
    return {
      valid: false,
      message: '至少要兩個中文字，或相當長度的中英文組合',
      type: 'error'
    };
  }
  
  // 檢查唯一性
  if (isUsernameTaken(trimmedUsername)) {
    return {
      valid: false,
      message: '此名稱已被使用',
      type: 'error'
    };
  }
  
  // 通過所有驗證
  return {
    valid: true,
    message: '此名稱可以使用',
    type: 'success'
  };
}