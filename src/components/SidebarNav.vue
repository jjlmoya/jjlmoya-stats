<script setup lang="ts">
import { LayoutDashboard, BarChart2, GitBranch } from 'lucide-vue-next';
import type { Component } from 'vue';

interface NavItem {
  label: string;
  href: string;
  icon: Component;
}

const items: NavItem[] = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Stats', href: '/stats', icon: BarChart2 },
  { label: 'Flow', href: '/flow', icon: GitBranch },
];

function isActive(href: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === href;
}
</script>

<template>
  <nav class="sidebar-nav">
    <a
      v-for="item in items"
      :key="item.href"
      :href="item.href"
      :class="['sidebar-nav__link', { 'sidebar-nav__link--active': isActive(item.href) }]"
    >
      <component :is="item.icon" class="sidebar-nav__icon" :size="16" />
      {{ item.label }}
    </a>
  </nav>
</template>

<style scoped>
@import "./SidebarNav.css";
</style>

