<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { setTokens } from '../utils/token';
import { handleOAuthCallback } from '../api/auth';
import type { OAuthProvider } from '../types/auth';

interface Props {
  provider: string;
}

const props = defineProps<Props>();
const error = ref<string | null>(null);

async function processCallback(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!code || !state) {
    error.value = 'Missing authentication parameters';
    return;
  }

  try {
    const provider = props.provider as OAuthProvider;
    const response = await handleOAuthCallback(provider, code, state);
    setTokens(response.data.accessToken, response.data.refreshToken);
    window.history.replaceState({}, '', window.location.pathname);
    window.location.href = '/';
  } catch {
    error.value = 'Authentication failed';
  }
}

onMounted(processCallback);
</script>

<template>
  <div class="auth-guard">
    <span v-if="error" class="auth-guard__error">{{ error }}</span>
    <span v-else class="auth-guard__text">Authenticating...</span>
  </div>
</template>
