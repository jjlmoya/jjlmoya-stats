<script setup lang="ts">
import { ref } from 'vue';

interface Emits {
  (e: 'filter', from: string, to: string): void;
}

const emit = defineEmits<Emits>();
const fromDate = ref(getDefaultFrom());
const toDate = ref(getDefaultTo());

function getDefaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

function getDefaultTo(): string {
  return new Date().toISOString().slice(0, 10);
}

function handleSubmit(): void {
  const from = new Date(fromDate.value).toISOString();
  const to = new Date(toDate.value + 'T23:59:59').toISOString();
  emit('filter', from, to);
}
</script>

<template>
  <form class="stats-filter" @submit.prevent="handleSubmit">
    <div class="stats-filter__field">
      <label class="stats-filter__label">From</label>
      <input v-model="fromDate" class="stats-filter__input" type="date" />
    </div>
    <div class="stats-filter__field">
      <label class="stats-filter__label">To</label>
      <input v-model="toDate" class="stats-filter__input" type="date" />
    </div>
    <button class="stats-filter__button" type="submit">Search</button>
  </form>
</template>

<style scoped>
@import "./StatsFilter.css";
</style>

