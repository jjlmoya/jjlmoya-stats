<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MoveRight } from 'lucide-vue-next';
import { getFlow } from '../api/stamp';
import type { FlowEdge } from '../types/stamp';

const edges = ref<FlowEdge[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function fetchFlow(): Promise<void> {
  const now = new Date();
  const week = new Date(now);
  week.setDate(week.getDate() - 7);

  try {
    const res = await getFlow(week.toISOString(), now.toISOString());
    edges.value = res.data.edges;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const forbidden = err.code === 'FORBIDDEN' || err.message === 'Forbidden';
    error.value = forbidden
      ? 'Sin acceso. Contacta con juanjo1989@gmail.com para solicitar permisos.'
      : (err.message ?? 'Failed to load flow');
  }

  loading.value = false;
}

onMounted(fetchFlow);
</script>

<template>
  <div v-if="loading" class="auth-guard">
    <span class="auth-guard__text">Loading flow...</span>
  </div>
  <div v-else-if="error" class="auth-guard">
    <span class="auth-guard__error">{{ error }}</span>
  </div>
  <div v-else-if="edges.length === 0" class="flow-list__empty">
    No flow data available
  </div>
  <div v-else class="flow-list">
    <div v-for="(edge, i) in edges" :key="i" class="flow-list__item">
      <span class="flow-list__from">{{ edge.from }}</span>
      <MoveRight class="flow-list__arrow" :size="14" />
      <span class="flow-list__to">{{ edge.to }}</span>
      <span class="flow-list__count">{{ edge.count }}</span>
    </div>
  </div>
</template>
