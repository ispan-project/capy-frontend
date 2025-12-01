# My Learning 課程評分功能

完整的互動式課程評分系統，包含課程卡片和評分對話框。

## 功能概覽

### 1. **MyLearningCourseCard.vue** - 課程卡片
互動式課程卡片，顯示課程資訊和評分功能。

#### 主要特點：
- **橫向 Flex 佈局**
  - 左側：縮圖（16:9 比例，圓角）
  - 右側：課程資訊堆疊

- **課程資訊**
  - 標題：粗體，最多顯示 2 行
  - 講師：灰色小字
  - 進度條：使用 `el-progress`，顏色為 `var(--capy-primary)`
  - 百分比文字顯示

- **互動式評分星星**
  - **未評分狀態**：
    - 顯示空心星星（void-icon）
    - 懸停時星星會放大
    - 點擊後觸發 `open-rate-dialog` 事件
    - 顯示文字：「留下評分」
  
  - **已評分狀態**：
    - 顯示填滿的黃色星星
    - 唯讀模式（可選擇性改為可編輯）
    - 顯示文字：「您的評分」

#### Props:
```typescript
{
  enrollment: {
    id: number
    course: {
      id: number
      title: string
      cover_image_url: string
      instructor_name: string
    }
    completion_percentage: number // 0-100
    my_review?: {
      rating: number
      comment: string
    }
  }
}
```

#### Events:
- `open-rate-dialog`: 當使用者點擊評分星星時觸發
- `card-click`: 當使用者點擊卡片時觸發（導航至課程）

---

### 2. **CourseRatingDialog.vue** - 評分對話框
模態對話框，讓使用者提交課程評分和評論。

#### 主要特點：

**對話框內容：**

1. **課程資訊區塊**
   - 顯示課程縮圖、標題和講師名稱
   - 淺灰色背景區塊

2. **評分星星**
   - 大尺寸 `el-rate` 元件（32px）
   - 可編輯
   - 顯示評分文字（非常差、差、普通、好、非常好）
   - 預設值從卡片點擊傳入

3. **評論輸入框**
   - `el-input` textarea 類型
   - 4 行高度
   - 提示文字：「請描述您的學習體驗、課程內容的優缺點等...」
   - 最多 500 字，顯示字數限制

4. **評論指南（可折疊）**
   - 使用 `el-collapse`
   - 包含評論撰寫建議：
     - 請具體描述課程內容和學習體驗
     - 保持建設性和禮貌的態度
     - 避免使用不當或冒犯性語言
     - 分享對其他學習者有幫助的資訊

5. **操作按鈕**
   - 取消按鈕（灰色）
   - 提交評論按鈕（Teal/Success 色）
   - 提交時顯示 loading 狀態
   - 未選擇評分時禁用提交按鈕

#### Props:
```typescript
{
  modelValue: boolean // 對話框顯示狀態
  courseInfo: {
    id: number
    title: string
    cover_image_url: string
    instructor_name: string
  }
  initialRating: number // 初始評分（從卡片傳入）
  initialComment: string // 初始評論（編輯時使用）
}
```

#### Events:
- `update:modelValue`: 更新對話框顯示狀態
- `review-submitted`: 評論提交成功時觸發，傳遞評分資料

#### API 邏輯（待實作）:
```javascript
// POST /api/courses/{id}/reviews
// Payload: { rating: number, comment: string }
```

---

### 3. **MyLearningPage.vue** - 整合頁面
整合課程卡片和評分對話框的主頁面。

#### 主要功能：

1. **課程列表顯示**
   - 使用新的 `enrollment` 資料結構
   - 支援篩選（全部、進行中、已結束）
   - 分頁功能

2. **評分對話框管理**
   - 維護對話框狀態
   - 處理評分提交
   - 更新課程評分資料

3. **事件處理**
   - `handleOpenRateDialog`: 開啟評分對話框
   - `handleReviewSubmitted`: 處理評論提交，更新本地資料
   - `goToCourse`: 導航至課程學習頁面

---

## 資料結構

### Enrollment Interface
```typescript
interface Enrollment {
  id: number
  course: {
    id: number
    title: string
    cover_image_url: string
    instructor_name: string
  }
  completion_percentage: number // 0-100
  my_review?: {
    rating: number // 1-5
    comment: string
  }
  status: 'ongoing' | 'completed'
}
```

---

## 使用流程

1. **使用者查看課程列表**
   - 看到課程卡片，包含進度和評分狀態

2. **點擊評分星星**
   - 如果未評分：星星會亮起，點擊後開啟評分對話框
   - 如果已評分：顯示已有的評分（黃色星星）

3. **在對話框中評分**
   - 選擇星星評分（1-5 星）
   - 輸入評論（選填）
   - 查看評論指南（選填）
   - 點擊「提交評論」

4. **提交後**
   - 顯示成功訊息
   - 對話框關閉
   - 卡片更新顯示新的評分

---

## 樣式特點

### 主題顏色
- 主要色：`var(--capy-primary)` (Teal)
- 評分星星：`#FFD700` (金黃色)
- 進度條：`var(--capy-primary)`

### 響應式設計
- **桌面版**：橫向卡片佈局
- **平板/手機**：垂直堆疊佈局
- 對話框自動調整寬度

### 互動效果
- 卡片懸停：陰影加深、輕微上移
- 星星懸停：放大效果
- 按鈕懸停：顏色變化

---

## TODO / 未來改進

- [ ] 實作實際的 API 呼叫
- [ ] 加入評論編輯功能
- [ ] 加入評論刪除功能
- [ ] 支援圖片上傳（評論附圖）
- [ ] 加入評分統計顯示
- [ ] 實作評論舉報功能
- [ ] 加入評論點讚功能

---

## 測試建議

1. **未評分課程**
   - 點擊星星應開啟對話框
   - 選擇評分後應能提交
   - 提交後卡片應顯示新評分

2. **已評分課程**
   - 應顯示黃色星星
   - 顯示「您的評分」文字

3. **對話框**
   - 未選擇評分時提交按鈕應禁用
   - 取消按鈕應關閉對話框
   - 提交成功應顯示訊息並關閉

4. **響應式**
   - 在不同螢幕尺寸下測試佈局
   - 確保對話框在手機上可用

---

## 檔案結構

```
src/components/StudentCenter/MyLearning/
├── MyLearningCourseCard.vue      # 課程卡片元件
├── CourseRatingDialog.vue        # 評分對話框元件
└── RATING_FEATURE.README.md      # 本文件

src/views/
└── MyLearningPage.vue            # 整合頁面