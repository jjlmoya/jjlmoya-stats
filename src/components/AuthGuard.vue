<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import { useAuthGuard } from '../composables/useAuthGuard';

const { loading, isAuthenticated } = useAuth();
useAuthGuard();
</script>

<template>
  <div v-if="loading" class="auth-guard">
    <span class="auth-guard__text">Loading...</span>
  </div>
  <slot v-else-if="isAuthenticated" />
</template>
