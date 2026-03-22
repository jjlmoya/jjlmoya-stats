<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';

const isDark = ref(true);

function applyTheme(): void {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light';
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

onMounted(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    isDark.value = saved === 'dark';
  } else {
    isDark.value = !window.matchMedia('(prefers-color-scheme: light)').matches;
  }
  applyTheme();
});

function toggle(): void {
  isDark.value = !isDark.value;
  applyTheme();
}
</script>

<template>
  <button
    class="theme-toggle"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="toggle"
  >
    <Sun v-if="isDark" class="theme-toggle__icon" :size="16" />
    <Moon v-else class="theme-toggle__icon" :size="16" />
  </button>
</template>
