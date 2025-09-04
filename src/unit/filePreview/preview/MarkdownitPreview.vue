<script lang="ts" setup>
import '@/assets/github-markdown.css'
import type { APIFile } from '@ftypes/api';
import type { MarkdownitPreviewInfo } from '@ftypes/preview';
import markdownit from 'markdown-it';
import '../css/MarkdownitPreview.css';

const markdown = markdownit();
const props = defineProps<{ file: APIFile, previewInfo: MarkdownitPreviewInfo }>()

</script>
<template>
    <div class="markdown-body" v-html="markdown.render(props.previewInfo.content)"></div>
</template>