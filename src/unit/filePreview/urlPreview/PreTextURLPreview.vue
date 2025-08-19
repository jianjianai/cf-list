<script setup lang="ts">
import { putNotification } from '@/unit/notification/notification';
import type { APIFile } from '@ftypes/api';
import { ref, onMounted } from 'vue';
import type { URLPreviewInfo } from '..';
import LoadError from '@/unit/smallElements/LoadError.vue';
import Loading from '@/unit/smallElements/Loading.vue';
import PreTextPreview from '../preview/PreTextPreview.vue';


const props = defineProps<{ file: APIFile, previewInfo: URLPreviewInfo }>()

const loading = ref(true);
const loadError = ref(false);
const innerText = ref<string>();
onMounted(async () => {
  try {
    const res = await fetch(props.previewInfo.url);
    if (!res.ok) {
      putNotification({ message: "加载 文本 文件失败!", type: "error", timeOut: 10000 });
    }
    innerText.value = await res.text();
  } catch (e) {
    putNotification({ message: "加载 文本 文件失败!", type: "error", timeOut: 10000 });
    loadError.value = true;
  }
  loading.value = false;
});

</script>

<template>
  <LoadError v-if="loadError" message="加载 文本 文件失败!"></LoadError>
  <Loading v-else-if="loading"></Loading>
  <PreTextPreview v-else :file="props.file" :previewInfo="{content:innerText!}"></PreTextPreview>
</template>

<style scoped></style>