<template>
  <div class="legal-content">
    <h1>CapyCourse 服務條款</h1>
    <p class="update-date">最後更新日期：2024年1月1日</p>

    <section>
      <h2>1. 服務說明</h2>
      <p>
        歡迎使用 CapyCourse 線上課程平台（以下簡稱「本平台」）。本平台由 River & Cloud Tech 營運，
        提供線上課程內容、教學服務及相關功能。使用本平台即表示您同意遵守本服務條款。
      </p>
    </section>

    <section>
      <h2>2. 帳號註冊與使用</h2>
      <p>
        2.1 您必須年滿 18 歲或在法定監護人同意下使用本平台。<br>
        2.2 您同意提供真實、準確的個人資訊進行註冊。<br>
        2.3 您有責任維護帳號安全，不得與他人共享帳號。<br>
        2.4 若發現帳號遭未經授權使用，請立即通知我們。
      </p>
    </section>

    <section>
      <h2>3. 課程購買與使用</h2>
      <p>
        3.1 課程價格以平台顯示為準，本平台保留調整價格的權利。<br>
        3.2 購買課程後，您將獲得該課程的永久觀看權限（除非課程被下架）。<br>
        3.3 課程內容僅供個人學習使用，不得用於商業用途或與他人分享。<br>
        3.4 本平台保留移除違反規定內容的權利。
      </p>
    </section>

    <section>
      <h2>4. 講師權利與義務</h2>
      <p>
        4.1 講師必須提供真實的個人資訊及銀行帳戶資料以接收收益。<br>
        4.2 講師上傳的課程內容必須為原創或已取得合法授權。<br>
        4.3 講師不得上傳侵犯他人智慧財產權、違法或不當的內容。<br>
        4.4 本平台將依約定比例分配課程收益給講師。
      </p>
    </section>

    <section>
      <h2>5. 智慧財產權</h2>
      <p>
        5.1 本平台及其內容（包括但不限於文字、圖片、影片、商標）受智慧財產權法保護。<br>
        5.2 未經授權，您不得複製、修改、散布或公開展示本平台內容。<br>
        5.3 講師保留其課程內容的智慧財產權，但授權本平台使用以提供服務。
      </p>
    </section>

    <section>
      <h2>6. 禁止行為</h2>
      <p>
        您同意不從事以下行為：<br>
        6.1 上傳或傳播違法、誹謗、騷擾、威脅或不當內容。<br>
        6.2 干擾或破壞本平台的正常運作。<br>
        6.3 使用自動化工具或機器人存取本平台。<br>
        6.4 嘗試未經授權存取他人帳號或系統。<br>
        6.5 從事任何可能損害本平台或其他使用者的行為。
      </p>
    </section>

    <section>
      <h2>7. 免責聲明</h2>
      <p>
        7.1 本平台「按現狀」提供服務，不保證服務不中斷或無錯誤。<br>
        7.2 課程內容由講師提供，本平台不對內容的準確性、完整性或適用性負責。<br>
        7.3 本平台不對因使用或無法使用服務而產生的任何損害負責。<br>
        7.4 您應自行評估課程內容是否符合您的需求。
      </p>
    </section>

    <section>
      <h2>8. 服務變更與終止</h2>
      <p>
        8.1 本平台保留隨時修改、暫停或終止服務的權利。<br>
        8.2 若您違反本條款，本平台有權暫停或終止您的帳號。<br>
        8.3 帳號終止後，您將失去存取課程的權限。
      </p>
    </section>

    <section>
      <h2>9. 條款修改</h2>
      <p>
        本平台保留隨時修改本服務條款的權利。修改後的條款將在平台上公告，
        繼續使用本平台即表示您接受修改後的條款。
      </p>
    </section>

    <section>
      <h2>10. 適用法律與管轄</h2>
      <p>
        本服務條款適用中華民國法律。因本條款產生的爭議，
        雙方同意以台灣台北地方法院為第一審管轄法院。
      </p>
    </section>

    <section>
      <h2>11. 聯絡方式</h2>
      <p>
        如對本服務條款有任何疑問，請聯絡我們：<br>
        電子郵件：<a href="mailto:support@capycourse.com">support@capycourse.com</a>
      </p>
    </section>
  </div>
</template>

<script setup>
// 純內容元件，無需額外邏輯
</script>

<style scoped>
.legal-content {
  color: var(--capy-text-primary);
  line-height: 1.8;
  max-width: 800px;
}

.legal-content h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--capy-text-primary);
}

.update-date {
  color: var(--capy-text-regular);
  font-size: 14px;
  margin-bottom: 32px;
}

.legal-content section {
  margin-bottom: 32px;
}

.legal-content h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--capy-primary-dark);
}

.legal-content p {
  margin-bottom: 12px;
  color: var(--capy-text-regular);
}

.legal-content a {
  color: var(--capy-primary);
  text-decoration: none;
}

.legal-content a:hover {
  color: var(--capy-primary-dark);
  text-decoration: underline;
}
</style>