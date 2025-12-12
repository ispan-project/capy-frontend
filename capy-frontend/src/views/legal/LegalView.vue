<template>
  <InfoPageLayout>
    <div class="legal-view">
      <!-- 主要內容區域 -->
      <div class="legal-main">
        <component :is="currentComponent" />
      </div>

      <!-- 目錄側邊欄（僅在桌面版顯示） -->
      <div v-if="showToc" class="toc-sidebar">
        <div class="toc-content">
          <h3 class="toc-title">目錄</h3>
          <nav class="toc-nav">
            <a
              v-for="heading in tocItems"
              :key="heading.id"
              :href="`#${heading.id}`"
              :class="['toc-item', `toc-level-${heading.level}`, { active: activeHeading === heading.id }]"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </a>
          </nav>
        </div>
      </div>
    </div>
  </InfoPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import InfoPageLayout from '@/layouts/InfoPageLayout.vue'
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent.vue'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent.vue'
import RefundPolicyContent from '@/components/legal/RefundPolicyContent.vue'

const route = useRoute()
const activeHeading = ref('')
const tocItems = ref([])
const showToc = ref(false)

// 根據路由決定顯示哪個元件
const currentComponent = computed(() => {
  const path = route.path

  if (path.includes('/legal/privacy')) {
    return PrivacyPolicyContent
  } else if (path.includes('/legal/refund')) {
    return RefundPolicyContent
  } else {
    // 預設顯示服務條款
    return TermsOfServiceContent
  }
})

// 生成目錄
const generateToc = () => {
  nextTick(() => {
    const content = document.querySelector('.legal-content')
    if (!content) return

    const headings = content.querySelectorAll('h2, h3')
    tocItems.value = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`
      heading.id = id

      return {
        id,
        text: heading.textContent,
        level: heading.tagName === 'H2' ? 2 : 3
      }
    })

    // 只在有足夠內容時顯示目錄
    showToc.value = tocItems.value.length > 3
  })
}

// 滾動到指定標題
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // 預留頂部空間
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 監聽滾動以高亮當前標題
const handleScroll = () => {
  const headings = tocItems.value.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  })).filter(item => item.element)

  // 找到當前可見的標題
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    const rect = heading.element.getBoundingClientRect()

    if (rect.top <= 100) {
      activeHeading.value = heading.id
      break
    }
  }
}

onMounted(() => {
  generateToc()
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 監聽路由變化重新生成目錄
import { watch } from 'vue'
watch(() => route.path, () => {
  generateToc()
})
</script>

<style scoped>
.legal-view {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 40px;
  position: relative;
}

/* 主要內容區域 */
.legal-main {
  min-width: 0; /* 防止內容溢出 */
}

/* 目錄側邊欄 */
.toc-sidebar {
  position: relative;
}

.toc-content {
  position: sticky;
  top: 100px;
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-lg);
  padding: 24px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.toc-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--capy-bg-surface);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-item {
  display: block;
  padding: 8px 12px;
  color: var(--capy-text-regular);
  text-decoration: none;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.toc-item:hover {
  background-color: var(--capy-bg-surface);
  color: var(--capy-primary);
}

.toc-item.active {
  background-color: rgba(84, 205, 242, 0.1);
  color: var(--capy-primary);
  font-weight: 500;
}

.toc-level-2 {
  padding-left: 12px;
}

.toc-level-3 {
  padding-left: 28px;
  font-size: 13px;
}

/* 自定義滾動條 */
.toc-content::-webkit-scrollbar {
  width: 6px;
}

.toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.toc-content::-webkit-scrollbar-thumb {
  background: var(--capy-text-regular);
  border-radius: 3px;
  opacity: 0.3;
}

.toc-content::-webkit-scrollbar-thumb:hover {
  background: var(--capy-primary);
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .legal-view {
    grid-template-columns: 1fr;
  }

  .toc-sidebar {
    display: none;
  }
}

/* 當沒有目錄時，內容佔滿整個寬度 */
.legal-view:not(:has(.toc-sidebar)) {
  grid-template-columns: 1fr;
}
</style>
