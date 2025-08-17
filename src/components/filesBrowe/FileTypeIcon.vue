<script setup lang="ts">
import { type Component, computed } from "vue";
import { getFolderIcon, getIconBySuffix } from "@/unit/fileTypesSvg";


const props = defineProps<{ fileType: string, fileName: string }>();
const icon = computed<Component>(() => {
  if (props.fileType === "folder") {
    return getFolderIcon();
  }
  const suffixLastIndex = props.fileName.lastIndexOf(".");
  const suffix = suffixLastIndex >= 0 ? props.fileName.substring(suffixLastIndex) : "";
  return getIconBySuffix(suffix);
});

</script>

<template>
  <component class="icon" :is="icon" :class="[props.fileType]"></component>
</template>

<style scoped>
.icon {
  width: 1em;
  color: var(--file-icon-c);
}

.icon.folder {
  color: var(--folder-icon-c);
}
</style>