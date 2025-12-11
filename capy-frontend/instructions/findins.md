Admin 頁面檢查報告

---
🟥 需修復
1. src/views/admin/user/ChangeUserStatusDialog.vue:64-70 - 初始 currentUserdetail 為 null，template 直接取 currentUserdetail.isActive 會在第一次渲染就拋錯，對話框無法開啟；需加預設值或 ?. 並在未 open 時避免存取。
2. src/views/admin/platform/Announcement.vue:223-226 - el-radio-button 只吃 label 作為值，目前會把 “All/平台/講師” 傳到 API，與後端預期的 "", "platform", "instructor" 不符，公告類型篩選實際失效。
3. src/views/admin/layout/AdminLayout.vue:75-86 - handleUserCommand 呼叫 ElMessage 但未 import，點擊頭像下拉會觸發 ReferenceError。
4. src/views/admin/course/ViewCourseDetail.vue:53-162 - 使用 ElMessage/ElMessageBox 但未 import，進入頁或執行審核操作會報錯。
5. src/views/admin/user/InstructorDetail.vue:123-205 - 同樣未 import ElMessage/ElMessageBox，錯誤提示與審核流程會直接拋 ReferenceError。
6. src/views/admin/course/CourseManagement.vue:77 - 取得課程列表失敗時呼叫 ElMessage 未 import。
7. src/views/admin/user/UserManagement.vue:60 - 取得用戶列表失敗時呼叫 ElMessage 未 import。
8. src/views/admin/user/InstructorList.vue:54 - 取得教師申請列表失敗時呼叫 ElMessage 未 import。

---
🟡 優化建議
1. src/views/admin/dashboard/WorkSpace.vue:151-154 - 熱門課程 Top5 的「查看」按鈕沒有 @click，建議導向課程詳情。
2. src/views/admin/user/InstructorDetail.vue:174-176 - catch 僅檢查 error !== "cancel"，MessageBox 若回傳物件時仍會當作錯誤，建議一併判斷 error?.message === "cancel"。
3. src/api/admin/course.js 與 src/api/admin/tag.js - getAllTags()、listAllTags() 都打 /admin/tags，功能重複可整併。
4. 分類管理功能缺席 - 路由 category_management 渲染 PlatformManagement(標籤管理) 並未處理分類，CateManagement.vue 仍是靜態樣板未使用，若需要「分類管理」需補齊實作。
