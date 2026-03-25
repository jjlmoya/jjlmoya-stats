<script setup lang="ts">
import { ArrowDown } from 'lucide-vue-next';
import type { PageView } from '../types/stamp';

defineProps<{
  views: PageView[];
  loading: boolean;
}>();

function getDuration(current: PageView, next: PageView): string {
  const start = new Date(current.createdAt).getTime();
  const end = new Date(next.createdAt).getTime();
  const diff = Math.max(0, end - start);
  
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
</script>

<template>
  <div v-if="loading" class="visit-table__loader">
    Cargando pasos...
  </div>
  <div v-else-if="views && views.length > 0" class="visit-table__flow">
    <template v-for="(view, i) in views" :key="view.id">
      <div class="visit-table__flow-item">
        <span class="visit-table__flow-index">{{ i + 1 }}</span>
        <span class="visit-table__flow-page">{{ view.page }}</span>
      </div>
      
      <div v-if="i < views.length - 1" class="visit-table__flow-transition-v">
        <div class="visit-table__flow-line" />
        <div class="visit-table__flow-duration-v">
          <ArrowDown :size="10" />
          <span>{{ getDuration(view, views[i+1]) }}</span>
        </div>
        <div class="visit-table__flow-line" />
      </div>
    </template>
  </div>
</template>

<style scoped>
@import "./VisitFlow.css";
</style>



