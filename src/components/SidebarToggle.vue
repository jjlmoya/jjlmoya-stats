<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { Menu, X } from 'lucide-vue-next';
import { useSidebar } from '../composables/useSidebar';

const { isOpen, toggle, close } = useSidebar();

watch(isOpen, (val) => {
  document.querySelector('.layout')?.classList.toggle('layout--open', val);
});

onMounted(() => {
  const mq = window.matchMedia('(width >= 769px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) close();
  });
});
</script>

<template>
  <button class="sidebar-toggle" :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'" @click="toggle">
    <X v-if="isOpen" :size="20" />
    <Menu v-else :size="20" />
  </button>
</template>

<style scoped>
@import "./SidebarToggle.css";
</style>

