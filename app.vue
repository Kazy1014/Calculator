<script setup lang="ts">
import Calculator from '~/components/Calculator.vue'

useHead({
  title: '電卓アプリ - Calculator App',
  meta: [
    { name: 'description', content: 'Nuxt3とTypeScriptで作成されたシンプルな電卓アプリ' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>電卓アプリ</h1>
      <p class="subtitle">Calculator App</p>
    </header>
    <main class="app-main">
      <Calculator />
    </main>
    <footer class="app-footer">
      <p>キーボードでも操作できます：数字・演算子（+, -, *, /）・Enter（=）・Escape（C）</p>
    </footer>
  </div>
</template>



<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-footer {
  text-align: center;
  color: white;
  margin-top: 30px;
  opacity: 0.9;
}

.app-footer p {
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .app-footer p {
    font-size: 0.8rem;
  }
}
</style>

