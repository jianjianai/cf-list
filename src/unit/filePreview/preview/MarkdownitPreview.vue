<script lang="ts" setup>
import '@/assets/github-markdown.css'
import type { APIFile } from '@ftypes/api';
import markdownit from 'markdown-it';
import '../css/MarkdownitPreview.css';

const markdown = markdownit();
export type MarkdownitPreviewInfo = { content: string; };
const props = defineProps<{ file: APIFile, previewInfo: MarkdownitPreviewInfo }>()

</script>
<template>
    <div class="markdownit-preview">
        <div class="markdown-body" v-html="markdown.render(props.previewInfo.content)"></div>
    </div>
</template>
<style scoped>
.markdownit-preview {
  padding: 0.5rem 0;
}
</style>