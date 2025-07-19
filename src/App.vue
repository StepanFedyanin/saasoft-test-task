<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <div class="app-header container">
      <h1 class="h2">
        Тестовое задание
      </h1>
    </div>
    <div class="app-content">
      <RouterView />
    </div>
    <div class="app-footer container d-flex gap-2">
      <p>Выполнил:</p>
      <a variant="primary" href="https://t.me/fedyanin_stepan" target="_blank">
        <i class="bi bi-telegram"></i> Федянин Степан
      </a>
    </div>
  </div>
</template>
