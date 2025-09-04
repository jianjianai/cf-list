<script lang="ts" setup>
import '@/assets/github-markdown.css'
import type { APIFile } from '@ftypes/api';
import MarkdownitPreview from '../preview/MarkdownitPreview.vue';
import type { URLPreviewInfo } from '@ftypes/preview';
import Loading from '@/unit/smallElements/Loading.vue';
import { ref, watch } from 'vue';
import { putNotification } from '@/unit/notification/notification';
import LoadError from '@/unit/smallElements/LoadError.vue';


const props = defineProps<{ file: APIFile, previewInfo: URLPreviewInfo }>()
const conent = ref<string>();
let controller: AbortController | undefined = undefined;
let isLoadError = ref<boolean>(false);
let isLoading = ref<boolean>(true);
watch(() => props.previewInfo.url, async () => {
    conent.value = undefined;
    isLoading.value = true;
    isLoadError.value = false;
    controller?.abort();
    controller = new AbortController();
    try {
        const res = await fetch(props.previewInfo.url, { signal: controller.signal });
        if (!res.ok) {
            isLoadError.value = true;
            putNotification({ message: "加载 Markdown 文件失败!", type: "error", noTimeOut: true });
            return;
        }
        conent.value = await res.text();
        isLoading.value = false;
    } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
            console.log("加载 Markdown 文件被取消");
            return;
        }
        isLoadError.value = true;
        putNotification({ message: "加载 Markdown 文件失败: " + e, type: "error", noTimeOut: true });
    }
}, { immediate: true });

</script>
<template>
    <LoadError v-if="isLoadError"></LoadError>
    <Loading v-else-if="isLoading"></Loading>
    <MarkdownitPreview v-else :file="props.file" :previewInfo="{ content: conent! }"></MarkdownitPreview>
</template>