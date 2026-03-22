<script setup lang="ts">
import { useSidebar } from '../composables/useSidebar';

const { close } = useSidebar();
</script>

<template>
  <div class="layout__overlay" @click="close" />
</template>
