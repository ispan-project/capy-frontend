/**
 * OAuth 認證相關的 Schema 定義
 * 用於表單驗證和 API 請求參數驗證
 */

// ==================== 註冊相關 Schema ====================

/**
 * 註冊參數介面
 */
export interface RegisterParam {
  email: string
  password: string
  nickname: string
  googleId?: string  // 選填，用於 Google OAuth 綁定
}

/**
 * 註冊表單驗證規則
 */
export const registerRules = {
  email: [
    { required: true, message: '請輸入電子郵件', trigger: 'blur' },
    { 
      type: 'email', 
      message: '請輸入有效的電子郵件格式', 
      trigger: ['blur', 'change'] 
    },
    {
      max: 255,
      message: '電子郵件長度不能超過 255 個字元',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { 
      min: 8, 
      message: '密碼長度至少需要 8 個字元', 
      trigger: 'blur' 
    },
    {
      max: 128,
      message: '密碼長度不能超過 128 個字元',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: '密碼必須包含大小寫字母、數字和特殊字元',
      trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: '請輸入暱稱', trigger: 'blur' },
    { 
      min: 2, 
      message: '暱稱長度至少需要 2 個字元', 
      trigger: 'blur' 
    },
    {
      max: 50,
      message: '暱稱長度不能超過 50 個字元',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/,
      message: '暱稱只能包含中英文、數字、底線和連字號',
      trigger: 'blur'
    }
  ]
}

// ==================== 登入相關 Schema ====================

/**
 * 登入參數介面
 */
export interface LoginParam {
  email: string
  password: string
}

/**
 * 登入表單驗證規則
 */
export const loginRules = {
  email: [
    { required: true, message: '請輸入電子郵件', trigger: 'blur' },
    { 
      type: 'email', 
      message: '請輸入有效的電子郵件格式', 
      trigger: ['blur', 'change'] 
    }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' }
  ]
}

// ==================== 忘記密碼相關 ====================

/**
 * 忘記密碼參數介面
 */
export interface ForgotPasswordParam {
  email: string
}

/**
 * 重設密碼參數介面
 */
export interface ResetPasswordParam {
  token: string
  newPassword: string
  confirmPassword: string
}

/**
 * 重設密碼表單驗證規則
 */
export const resetPasswordRules = {
  newPassword: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    { 
      min: 8, 
      message: '密碼長度至少需要 8 個字元', 
      trigger: 'blur' 
    },
    {
      max: 128,
      message: '密碼長度不能超過 128 個字元',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: '密碼必須包含大小寫字母、數字和特殊字元',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '請再次輸入密碼', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function, source: any) => {
        if (value !== source.newPassword) {
          callback(new Error('兩次輸入的密碼不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// ==================== 工具函數 ====================

/**
 * 驗證電子郵件格式
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 驗證密碼強度
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  message: string
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      strength: 'weak',
      message: '密碼長度至少需要 8 個字元'
    }
  }

  let strength = 0
  
  // 檢查是否包含小寫字母
  if (/[a-z]/.test(password)) strength++
  
  // 檢查是否包含大寫字母
  if (/[A-Z]/.test(password)) strength++
  
  // 檢查是否包含數字
  if (/\d/.test(password)) strength++
  
  // 檢查是否包含特殊字元
  if (/[@$!%*?&]/.test(password)) strength++

  if (strength < 3) {
    return {
      isValid: false,
      strength: 'weak',
      message: '密碼強度較弱，建議包含大小寫字母、數字和特殊字元'
    }
  } else if (strength === 3) {
    return {
      isValid: true,
      strength: 'medium',
      message: '密碼強度中等'
    }
  } else {
    return {
      isValid: true,
      strength: 'strong',
      message: '密碼強度良好'
    }
  }
}

/**
 * 清理註冊參數（移除空白字元）
 */
export const sanitizeRegisterParam = (param: RegisterParam): RegisterParam => {
  return {
    email: param.email.trim().toLowerCase(),
    password: param.password,  // 密碼不做 trim，保留原始輸入
    nickname: param.nickname.trim(),
    googleId: param.googleId?.trim()
  }
}

/**
 * 清理登入參數（移除空白字元）
 */
export const sanitizeLoginParam = (param: LoginParam): LoginParam => {
  return {
    email: param.email.trim().toLowerCase(),
    password: param.password  // 密碼不做 trim，保留原始輸入
  }
}
