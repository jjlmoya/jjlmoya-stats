<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PageStatsResult } from '../types/stamp';

interface Props {
  pages: PageStatsResult[];
  selected: string | null;
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [page: string];
}>();

const search = ref('');
let hoverTimer: ReturnType<typeof window.setTimeout> | null = null;

const filtered = computed(() =>
  props.pages.filter((p) =>
    p.page.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

function onHover(page: string): void {
  if (hoverTimer) window.clearTimeout(hoverTimer);
  hoverTimer = window.setTimeout(() => emit('select', page), 150);
}
</script>

<template>
  <div class="page-list">
    <div class="page-list__toolbar">
      <input
        v-model="search"
        class="page-list__search"
        type="text"
        placeholder="Buscar página..."
      />
      <span class="page-list__count-label">{{ filtered.length }} / {{ pages.length }}</span>
    </div>
    <div v-if="loading" class="page-list__state">
      <span class="page-list__state-text">Cargando páginas...</span>
    </div>
    <ul v-else class="page-list__items">
      <li
        v-for="p in filtered"
        :key="p.page"
        :class="['page-list__item', { 'page-list__item--active': selected === p.page }]"
        @mouseenter="onHover(p.page)"
      >
        <span class="page-list__url">{{ p.page }}</span>
        <span class="page-list__views">{{ p.totalViews }}</span>
      </li>
      <li v-if="!filtered.length && !loading" class="page-list__item page-list__item--empty">
        <span class="page-list__state-text">Sin resultados</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "./PageList.css";
</style>
