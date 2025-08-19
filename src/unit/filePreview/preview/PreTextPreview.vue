<script setup lang="ts">
import '../css/PreTextPreview.css';
import type { APIFile } from '@ftypes/api';

export type PreTextPreviewPreviewInfo = { content: string; };
const props = defineProps<{ file: APIFile, previewInfo: PreTextPreviewPreviewInfo }>()
</script>

<template>
  <div class="pre-text">
    <div class="title">{{ props.file.name }}</div>
    <pre class="body">{{ props.previewInfo.content }}</pre>
  </div>
</template>

<style scoped>
.title {
  border: var(--pre-text-player-border);
  border-bottom: none;
  border-radius: 0.8rem 0.8rem 0 0;
  width: calc(100% - 2rem);
  padding: 0.5rem 1rem;
  background-color: var(--pre-text-player-title-bgc);
  font-size: 0.9rem;
  font-weight: bolder;
}

.body {
  border: var(--pre-text-player-border);
  border-radius: 0 0 0.8rem 0.8rem;
  padding: 1rem;
  width: calc(100% - 2rem);
  max-height: 70vh;
  margin: 0;
  overflow: auto;
}

.pre-text {
  padding: 1rem 0;
}
</style>