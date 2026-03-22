<script setup lang="ts">
import { ShieldOff } from 'lucide-vue-next';
</script>

<template>
  <div class="no-permission">
    <ShieldOff class="no-permission__icon" :size="32" />
    <span class="no-permission__title">Sin acceso</span>
    <p class="no-permission__text">
      No tienes permisos para ver este contenido. Contacta con
      <a class="no-permission__link" href="mailto:juanjo1989@gmail.com">juanjo1989@gmail.com</a>
      para solicitar acceso.
    </p>
  </div>
</template>
