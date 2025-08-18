<script setup lang="ts">
import './GenericDown.css';
import type { APIFile, APIFileDownloadInfo } from "@ftypes/api.js";
import { dateFormat } from "../format/dateFormat";
import { fileSizeFormat } from "../format/fileSizeFormat";
import { computed } from "vue";
import { putNotification } from "../notification/notification";
import FileTypeIcon from "@/components/filesBrowe/FileTypeIcon.vue";
import AButton from "../smallElements/AButton.vue";

const props = defineProps<{ file: APIFile }>()
const fileDownloadInfo = computed<APIFileDownloadInfo>(() => {
  return {
    type: "url",
    url: "test",
  }
})

function copyLink() {
  navigator.clipboard.writeText(fileDownloadInfo.value.url);
  putNotification({ message: "链接已复制", type: "success" });
}

</script>

<template>
  <div class="down">
    <FileTypeIcon :fileName="props.file.name" :fileType="props.file.type" class="icon"></FileTypeIcon>
    <div class="name">{{ props.file.name }}</div>
    <div class="info" v-if="props.file.size || props.file.lastModified">
      <div v-if="props.file.size">{{ fileSizeFormat(props.file.size) }}</div>
      <div v-if="props.file.lastModified">{{ dateFormat(props.file.lastModified) }}</div>
    </div>
    <div class="buttons">
      <AButton class="button-color-grep1" @click="copyLink()">复制链接</AButton>
      <AButton target="_blank" :href="fileDownloadInfo.url">下载</AButton>
    </div>
  </div>
</template>

<style scoped>
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.info {
  margin-top: 0.8rem;
  font-size: 0.8rem;
  color: var(--info-f-color);
  display: flex;
  gap: 0.5rem;
}

.name {
  font-weight: bolder;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  max-width: 100%;
  word-wrap: break-word;
  text-align: center;
}

.icon {
  width: 5rem;
  color: var(--info-t-color);
}

.down {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem 0;
}
</style>