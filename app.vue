<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue'

useHead({
  title: '高度な電卓アプリ - Advanced Calculator',
  meta: [
    { name: 'description', content: 'Nuxt3とTypeScriptで作成された高度な科学計算電卓アプリ' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<template>
  <div class="app-root">
    <MainLayout />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-root {
  width: 100%;
  min-height: 100vh;
}
</style>
