import instance from "../../utils/http.js";

/**
 * 更新學生個人資料
 * @param {Object} profileData - 個人資料物件
 * @param {string} profileData.nickname - 暱稱
 * @param {string} profileData.avatarUrl - 頭像 URL
 * @returns {Promise} 回傳更新後的使用者資料
 */
export const updateStudentProfile = (profileData) => {
  return instance.put("/student/profile/update", profileData);
};

/**
 * 獲取學生個人資料
 * @returns {Promise} 回傳學生個人資料
 */
export const getStudentProfile = () => {
  return instance.get("/student/profile");
};

/**
 * 上傳學生頭像
 * @param {File} file - 頭像檔案
 * @returns {Promise} 回傳上傳後的頭像 URL
 */
export const uploadStudentAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  return instance.post("/student/profile/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 更新學生密碼
 * @param {Object} passwordData - 密碼資料物件
 * @param {string} passwordData.currentPassword - 當前密碼
 * @param {string} passwordData.newPassword - 新密碼
 * @returns {Promise} 回傳更新結果
 */
export const updateStudentPassword = (passwordData) => {
  return instance.put("/student/change-password", {
    currentPassword: passwordData.currentPassword || passwordData.oldPassword,
    newPassword: passwordData.newPassword
  });
};

/**
 * 刪除學生帳號（軟刪除）
 * @returns {Promise} 回傳刪除結果
 */
export const deleteStudentAccount = () => {
  return instance.delete("/student/profile");
};

/**
 * 綁定 Google 帳號
 * @param {Object} bindData - 綁定資料物件
 * @param {string} bindData.googleId - Google ID
 * @param {string} bindData.password - 使用者密碼（用於驗證身份）
 * @returns {Promise} 回傳綁定結果
 * @example
 * bindGoogleAccount({ googleId: "123456789", password: "userPassword" })
 */
export const bindGoogleAccount = (bindData) => {
  return instance.post("/student/account/bindGoogle", bindData);
};

/**
 * 解除 Google 帳號綁定
 * @param {Object} unlinkData - 解除綁定資料物件
 * @param {string} unlinkData.password - 使用者密碼（用於驗證身份）
 * @returns {Promise} 回傳解除綁定結果
 * @example
 * unlinkGoogleAccount({ password: "userPassword" })
 */
export const unlinkGoogleAccount = (unlinkData) => {
  return instance.post("/student/account/unlinkGoogle", unlinkData);
};
