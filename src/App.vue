<script setup lang="ts">
import { RouterView } from 'vue-router'
import Notification from './unit/notification/Notification.vue';
import { putNotification } from './unit/notification/notification';

</script>

<template>
  <RouterView />
  <Notification />
</template>

<style scoped>

</style>
