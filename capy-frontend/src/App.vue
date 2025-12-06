<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

onMounted(async () => {
  await userStore.init()

  // 只有在已登入時才從 localStorage 載入購物車和願望清單
  if (userStore.isAuthenticated) {
    cartStore.loadFromStorage()
    wishlistStore.loadFromStorage()
  }
})

</script>
<template>
  <RouterView />
</template>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}
</style>
