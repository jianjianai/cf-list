<script setup lang="ts">
import '../css/PreTextPreview.css';
import type { APIFile } from '@ftypes/api';

export type PreTextPreviewPreviewInfo = { content: string; };
const props = defineProps<{ file: APIFile, previewInfo: PreTextPreviewPreviewInfo }>()
</script>

<template>
  <pre class="pre-text">{{ props.previewInfo.content }}</pre>
</template>

<style scoped>
.pre-text {
  padding: 1rem 0;
}
</style>