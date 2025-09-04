<script setup lang="ts">
import type { APIFile } from "@ftypes/api";
import type { URLPreviewInfo } from "@ftypes/preview";


const props = defineProps<{ file: APIFile, previewInfo: URLPreviewInfo }>()

</script>

<template>
  <div class="img-preview">
    <img :src="props.previewInfo.url" alt="Image Preview" class="image" />
  </div>
</template>

<style scoped>
.img-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}
</style>