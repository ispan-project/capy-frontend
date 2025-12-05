# StudentProfileEditDialog API 整合狀態

## ✅ 已完成的後端 API 整合

### 1. 個人資料管理
- **獲取個人資料**: `getStudentProfile()` 
  - 端點: `GET /student/profile`
  - 狀態: ✅ 已整合
  - 使用位置: 對話框開啟時自動獲取

- **更新個人資料**: `updateStudentProfile(profileData)`
  - 端點: `PUT /student/profile/update`
  - 狀態: ✅ 已整合
  - 參數: `{ nickname, avatarUrl }`

- **上傳頭像**: `uploadStudentAvatar(file)`
  - 端點: `POST /student/profile/avatar`
  - 狀態: ✅ 已整合
  - 格式: `multipart/form-data`

### 2. 密碼管理
- **更新密碼**: `updateStudentPassword(passwordData)`
  - 端點: `PUT /student/change-password`
  - 狀態: ✅ 已整合
  - 參數: `{ currentPassword, newPassword }`
  - 需要: JWT Token

### 3. Google 帳號綁定
- **綁定 Google 帳號**: `bindGoogleAccount(bindData)`
  - 端點: `POST /student/account/bindGoogle`
  - 狀態: ✅ 已整合
  - 參數: `{ googleId, password }`
  - 需要: JWT Token
  - 後端驗證: 使用 `passwordEncoder.matches` 驗證密碼
  - 錯誤處理:
    - 401: 密碼錯誤 (`Invalid password`)
    - 409: Google 帳號已被綁定
  - 流程: 密碼驗證 → OAuth 授權 → 回調完成綁定

- **解除 Google 綁定**: `unlinkGoogleAccount(unlinkData)`
  - 端點: `POST /student/account/unlinkGoogle`
  - 狀態: ✅ 已整合
  - 參數: `{ password }`
  - 流程: 確認對話框 → 密碼驗證 → API 調用

### 4. 帳號管理
- **刪除帳號**: `deleteStudentAccount()`
  - 端點: `DELETE /student/profile`
  - 狀態: ✅ 已整合
  - 流程: 輸入 "DELETE" 確認 → API 調用 → 登出

## ⚠️ 待實作的功能

### 1. 暱稱唯一性檢查
- **API 函數**: `checkNicknameAvailability(nickname)` (待建立)
- **建議端點**: `GET /student/profile/check-nickname?nickname={nickname}`
- **回應格式**:
```json
{
  "available": true,
  "message": "暱稱可用"
}
```

- **實作位置**: `src/api/student/Studentcenter.js`
- **使用位置**: `validateNicknameUnique()` 函數

### 實作範例：

```javascript
// 在 src/api/student/Studentcenter.js 中新增
export const checkNicknameAvailability = (nickname) => {
  return instance.get("/student/profile/check-nickname", {
    params: { nickname }
  });
};
```

```javascript
// 在 StudentProfileEditDialog.vue 中使用
import { checkNicknameAvailability } from '@/api/student/Studentcenter'

const validateNicknameUnique = async (rule, value, callback) => {
  if (!value || value === currentUserData.value.nickname) {
    return callback()
  }

  try {
    const response = await checkNicknameAvailability(value)
    if (!response.available) {
      return callback(new Error('此暱稱已被使用'))
    }
    callback()
  } catch (error) {
    console.error('Nickname validation error:', error)
    callback()
  }
}
```

## 📋 API 調用流程圖

### 個人資料更新流程
```
[使用者編輯資料] 
    ↓
[點擊儲存] 
    ↓
[表單驗證]
    ↓
[上傳頭像 (如有)] → uploadStudentAvatar()
    ↓
[更新個人資料] → updateStudentProfile()
    ↓
[更新 UserStore]
    ↓
[關閉對話框]
```

### Google 綁定流程
```
[點擊連結 Google]
    ↓
[密碼驗證對話框]
    ↓
[暫存密碼到 sessionStorage]
    ↓
[跳轉 Google OAuth]
    ↓
[Google 授權]
    ↓
[回調到 /oauth-callback]
    ↓
[AuthCallback.vue 處理]
    ↓
[調用 bindGoogleAccount()] → POST /student/profile/bind-google
    ↓
[更新 UserStore]
    ↓
[跳轉回原頁面]
```

### Google 解除綁定流程
```
[點擊解除連結]
    ↓
[確認對話框]
    ↓
[密碼驗證對話框]
    ↓
[調用 unlinkGoogleAccount()] → POST /student/account/unlinkGoogle
    ↓
[更新 UserStore (移除 google_id)]
    ↓
[重新獲取個人資料]
    ↓
[更新 UI 狀態]
```

## 🔒 安全性機制

1. **密碼驗證**: 所有敏感操作都需要密碼驗證
2. **雙重確認**: 刪除帳號需要輸入 "DELETE" 確認
3. **資料同步**: 操作後立即重新獲取個人資料
4. **錯誤處理**: 完整的 try-catch 和使用者提示
5. **暫存清理**: OAuth 流程完成後清除 sessionStorage

## 📝 後端 API 需求總結

### 已實作的端點 (7個)
1. `GET /student/profile` - 獲取個人資料
2. `PUT /student/profile/update` - 更新個人資料
3. `POST /student/profile/avatar` - 上傳頭像
4. `PUT /student/change-password` - 更新密碼 (需要 JWT)
5. `POST /student/account/bindGoogle` - 綁定 Google (需要 JWT，後端驗證密碼)
6. `POST /student/account/unlinkGoogle` - 解除 Google 綁定
7. `DELETE /student/profile` - 刪除帳號

### 待實作的端點 (1個)
1. `GET /student/profile/check-nickname` - 檢查暱稱可用性

## 🎯 下一步行動

1. **後端**: 實作暱稱檢查 API
2. **前端**: 整合暱稱檢查 API 到驗證函數
3. **測試**: 完整測試所有 API 整合
4. **文件**: 更新 API 文件