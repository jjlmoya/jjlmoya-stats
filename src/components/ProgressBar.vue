<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  pct: number;
}

const props = defineProps<Props>();
const width = computed(() => props.pct + '%');
</script>

<template>
  <div class="progress-bar">
    <div class="progress-bar__fill" />
  </div>
</template>

<style scoped>
.progress-bar {
  height: 4px;
  background-color: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: var(--color-accent);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: v-bind(width);
}
</style>
