<script setup lang="ts">
import { LogOut } from 'lucide-vue-next';
import { logout } from '../api/auth';
import { getRefreshToken, clearTokens } from '../utils/token';

async function handleLogout(): Promise<void> {
  const token = getRefreshToken();
  if (token) {
    await logout(token).catch(() => undefined);
  }
  clearTokens();
  window.location.href = '/login';
}
</script>

<template>
  <button class="logout-button" @click="handleLogout">
    <LogOut :size="14" />
    Logout
  </button>
</template>

<style scoped>
@import "./LogoutButton.css";
</style>

