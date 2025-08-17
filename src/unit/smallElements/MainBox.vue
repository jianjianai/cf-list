<script setup lang="ts">
import './MainBox.css'

</script>

<template>
  <div class="main-box">
    <slot></slot>
  </div>
</template>

<style scoped>
.main-box{
  background-color: var(--mian-box-bgc);
  border-radius: 0.8rem;
  padding: 0.8rem;
  box-shadow: var(--mian-box-shadow);
}
</style>