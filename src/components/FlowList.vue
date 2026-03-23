<script setup lang="ts">
import { ref, computed } from 'vue';
import { MoveRight } from 'lucide-vue-next';
import { getFlow, getVisits } from '../api/stamp';
import type { PageView, VisitSummary } from '../types/stamp';
import NoPermission from './NoPermission.vue';
import PeriodFilter from './PeriodFilter.vue';
import VisitTable from './VisitTable.vue';
import StatCard from './StatCard.vue';

const visitId = ref('');
const views = ref<PageView[]>([]);
const visits = ref<VisitSummary[]>([]);
const loadingList = ref(false);
const loadingFlow = ref(false);
const error = ref<string | null>(null);
const forbidden = ref(false);
const periodLabel = ref('Hoy');

const avgPages = computed(() => {
  if (visits.value.length === 0) return 0;
  const total = visits.value.reduce((s, v) => s + v.pageCount, 0);
  return (total / visits.value.length).toFixed(1);
});

async function onPeriodChange(from: string, to: string, label: string): Promise<void> {
  periodLabel.value = label;
  loadingList.value = true;
  error.value = null;
  forbidden.value = false;
  visits.value = [];

  try {
    const res = await getVisits({ from, to });
    visits.value = res.data;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === 'FORBIDDEN' || err.message === 'Forbidden') {
      forbidden.value = true;
    } else {
      error.value = err.message ?? 'Failed to load visits';
    }
  }

  loadingList.value = false;
}

async function fetchFlow(id?: string): Promise<void> {
  if (id) visitId.value = id;
  if (!visitId.value.trim()) return;
  
  loadingFlow.value = true;
  error.value = null;
  forbidden.value = false;
  views.value = [];

  try {
    const res = await getFlow(visitId.value.trim());
    views.value = res.data;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === 'FORBIDDEN' || err.message === 'Forbidden') {
      forbidden.value = true;
    } else {
      error.value = err.message ?? 'Failed to load flow';
    }
  }

  loadingFlow.value = false;
}
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <span class="overview__period">Flujos de Navegación</span>
      <span class="overview__date">{{ periodLabel }}</span>
    </div>

    <PeriodFilter initial-period="today" @change="onPeriodChange" />

    <div v-if="loadingList && visits.length === 0" class="auth-guard">
      <span class="auth-guard__text">Sincronizando visitas...</span>
    </div>
    <NoPermission v-else-if="forbidden" />
    <div v-else-if="error" class="auth-guard">
      <span class="auth-guard__error">{{ error }}</span>
    </div>

    <template v-else>
      <div class="overview__cards flow-list__cards">
        <StatCard label="Sesiones registradas" :value="visits.length" />
        <StatCard label="Promedio pasos" :value="avgPages" unit="págs" />
      </div>

      <div class="overview__section">
        <span class="overview__section-title">Listado de Visitas</span>
        <div class="overview__table-wrap">
          <VisitTable 
            :visits="visits" 
            :loading="loadingList" 
            @select="fetchFlow"
          />
        </div>
      </div>

      <div v-if="loadingFlow || views.length > 0" class="overview__section">
        <span class="overview__section-title">Pasos del Flujo</span>
        <div v-if="loadingFlow" class="overview__top flow-list__loading-centered">
          <span class="auth-guard__text">Cargando pasos...</span>
        </div>
        <div v-else class="overview__top">
          <div class="flow-detail-header">
            <span class="flow-detail-id">ID: {{ visitId }}</span>
          </div>
          <div v-for="(view, i) in views" :key="view.id" class="overview__top-item">
            <span class="overview__top-rank">{{ i + 1 }}</span>
            <div class="overview__top-info">
              <div class="overview__top-meta">
                <span class="overview__top-page">{{ view.page }}</span>
                <span class="overview__top-count flow-detail-time">
                  {{ new Date(view.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) }}
                </span>
              </div>
            </div>
            <MoveRight v-if="i < views.length - 1" class="flow-list__arrow" :size="12" />
          </div>
        </div>
      </div>
      <div v-else class="overview__empty flow-list__empty--card">
        Selecciona una visita del listado anterior para inspeccionar su recorrido detallado
      </div>
    </template>
  </div>
</template>
