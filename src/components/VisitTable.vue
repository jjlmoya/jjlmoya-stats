<script setup lang="ts">
import { ref, computed } from 'vue';
import { X } from 'lucide-vue-next';
import type { VisitSummary } from '../types/stamp';

const props = defineProps<{
  visits: VisitSummary[];
  loading: boolean;
}>();

const emit = defineEmits<{
  select: [visitId: string];
}>();

const search = ref('');

const filteredVisits = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.visits;
  return props.visits.filter(v => v.visitId.toLowerCase().includes(q) || v.firstPage.toLowerCase().includes(q));
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}
</script>

<template>
  <div class="stats-table__wrapper">
    <div class="stats-table__search">
      <input
        v-model="search"
        class="stats-table__search-input"
        type="text"
        placeholder="Buscar por ID de visita o página..."
      />
      <button v-if="search" class="stats-table__search-clear" @click="search = ''">
        <X :size="14" />
      </button>
    </div>

    <div v-if="loading" class="stats-table__empty">
      Cargando visitas...
    </div>
    <div v-else-if="filteredVisits.length === 0" class="stats-table__empty">
      Sin resultados para este periodo
    </div>
    <table v-else class="stats-table">
      <thead class="stats-table__head">
        <tr>
          <th class="stats-table__cell stats-table__cell--header">Última actividad</th>
          <th class="stats-table__cell stats-table__cell--header">ID de Visita</th>
          <th class="stats-table__cell stats-table__cell--header">Página Inicial</th>
          <th class="stats-table__cell stats-table__cell--header stats-table__cell--number">Páginas</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="visit in filteredVisits" 
          :key="visit.visitId" 
          class="stats-table__row visit-table__row"
          @click="emit('select', visit.visitId)"
        >
          <td class="stats-table__cell stats-table__cell--muted">{{ formatDate(visit.startedAt) }}</td>
          <td class="stats-table__cell stats-table__cell--page visit-table__id">{{ visit.visitId }}</td>
          <td class="stats-table__cell stats-table__cell--page">{{ visit.firstPage }}</td>
          <td class="stats-table__cell stats-table__cell--number stats-table__cell--muted">{{ visit.pageCount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
