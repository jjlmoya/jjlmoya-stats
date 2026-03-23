<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next';
import type { PageView } from '../types/stamp';

defineProps<{
  views: PageView[];
  loading: boolean;
}>();
</script>

<template>
  <div v-if="loading" class="visit-table__loader">
    Cargando pasos...
  </div>
  <div v-else-if="views && views.length > 0" class="visit-table__flow">
    <div v-for="(view, i) in views" :key="view.id" class="visit-table__flow-item">
      <span class="visit-table__flow-index">{{ i + 1 }}</span>
      <span class="visit-table__flow-page">{{ view.page }}</span>
      <MoveRight v-if="i < views.length - 1" class="visit-table__flow-arrow" :size="12" />
    </div>
  </div>
</template>
