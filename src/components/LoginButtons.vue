<script setup lang="ts">
import { ref } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import type { OAuthProvider } from '../types/auth';
import { getOAuthUrl } from '../api/auth';
import GoogleIcon from './icons/GoogleIcon.vue';
import DiscordIcon from './icons/DiscordIcon.vue';
import TwitchIcon from './icons/TwitchIcon.vue';

const providers: OAuthProvider[] = ['google', 'discord', 'twitch'];
const icons = { google: GoogleIcon, discord: DiscordIcon, twitch: TwitchIcon };
const loadingProvider = ref<OAuthProvider | null>(null);

async function handleLogin(provider: OAuthProvider): Promise<void> {
  loadingProvider.value = provider;
  try {
    const response = await getOAuthUrl(provider);
    window.location.href = response.data.url;
  } catch {
    loadingProvider.value = null;
  }
}
</script>

<template>
  <div class="login-buttons">
    <button
      v-for="provider in providers"
      :key="provider"
      :class="['login-buttons__item', `login-buttons__item--${provider}`]"
      :disabled="loadingProvider !== null"
      @click="handleLogin(provider)"
    >
      <Loader2 v-if="loadingProvider === provider" class="login-buttons__spinner" :size="16" />
      <component :is="icons[provider]" v-else class="login-buttons__icon" />
      <span class="login-buttons__text">{{ provider }}</span>
    </button>
  </div>
</template>
