<script setup lang="ts">
import { ref } from 'vue';
import { MoveRight } from 'lucide-vue-next';
import { getFlow } from '../api/stamp';
import type { PageView } from '../types/stamp';
import NoPermission from './NoPermission.vue';

const visitId = ref('');
const views = ref<PageView[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const forbidden = ref(false);

async function fetchFlow(): Promise<void> {
  if (!visitId.value.trim()) return;
  loading.value = true;
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

  loading.value = false;
}
</script>

<template>
  <div class="flow-search">
    <input
      v-model="visitId"
      class="flow-search__input"
      type="text"
      placeholder="Visit ID"
      @keydown.enter="fetchFlow"
    />
    <button class="flow-search__button" :disabled="loading" @click="fetchFlow">
      Search
    </button>
  </div>
  <div v-if="loading" class="auth-guard">
    <span class="auth-guard__text">Loading flow...</span>
  </div>
  <NoPermission v-else-if="forbidden" />
  <div v-else-if="error" class="auth-guard">
    <span class="auth-guard__error">{{ error }}</span>
  </div>
  <div v-else-if="views.length === 0 && visitId" class="flow-list__empty">
    No flow data for this visit
  </div>
  <div v-else-if="views.length > 0" class="flow-list">
    <div v-for="(view, i) in views" :key="view.id" class="flow-list__item">
      <span class="flow-list__index">{{ i + 1 }}</span>
      <span class="flow-list__page">{{ view.page }}</span>
      <MoveRight v-if="i < views.length - 1" class="flow-list__arrow" :size="14" />
    </div>
  </div>
</template>
