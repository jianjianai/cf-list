<script setup lang="ts">
import BriwesFile from '@/components/filesBrowe/BriwesFile.vue';
import BriwesFolder from '@/components/filesBrowe/BriwesFolder.vue';
import BriwesLoading from '@/components/filesBrowe/BriwesLoading.vue';
import BriwesNoFIle from '@/components/filesBrowe/BriwesNoFIle.vue';
import BrowesBreadcrumb from '@/components/filesBrowe/BrowesBreadcrumb.vue';
import BrowesPageHeader from '@/components/filesBrowe/BrowesPageHeader.vue';
import { serverApiBrowse } from '@/unit/serverApi/readFile';
import ButtonLink from '@/unit/smallElements/ButtonLink.vue';
import type { APIFile, APIFileList, APIView } from '@ftypes/api';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const filePath = computed(() => `/${Array.isArray(route.params.path) ? route.params.path.join("/") : ""}`);


//------------------- 文件列表和文件预览 ------------------------
const view = ref<APIView>();
// 加载状态
const loading = ref(true);
// 当前viewType对应的路径
const currentPath = ref<string>("");
export type ToDirFunction = typeof toDir;
// 取消跳转加载的函数
let abortToDir: (() => void) | null = null;
async function toDir(path: string, file?: APIView) {
  let abort = false;
  if (currentPath.value == path) {
    return;
  }
  currentPath.value = path;
  if (filePath.value != path) {
    router.push({ path: path });
  }
  loading.value = true;
  abortToDir?.();
  let controller = new AbortController();
  abortToDir = () => {
    abort = true;
    controller.abort();
    abortToDir = null;
  }
  let v = file;
  if (!v) {
    v = await serverApiBrowse.view(path, controller);
  }
  if (abort) {
    return;
  }
  view.value = v;
  loading.value = false;
}
watch(filePath, async () => toDir(filePath.value), { immediate: true });


</script>

<template>
  <div class="page-main">
    <div class="page-layouts">
      <BrowesPageHeader></BrowesPageHeader>
      <BrowesBreadcrumb :currentPath="filePath"></BrowesBreadcrumb>

      <BriwesLoading v-if="loading" />
      <template v-else>
        <!-- 文件列表 -->
        <BriwesFolder v-if="view?.list" :filelist="view.list" :currentPath="currentPath"
          :toDir="toDir"></BriwesFolder>
        <!-- 预览 -->
        <BriwesFile v-if="view?.infoFile" :file="view.infoFile.file" :currentPath="view.infoFile.path"></BriwesFile>
        <BriwesNoFIle v-if="!view?.infoFile && !view?.list">文件不存在</BriwesNoFIle>
      </template>

    </div>
    <div class="footer">
      <ButtonLink to="https://github.com/jianjianai/FList">由 CFList 强力驱动</ButtonLink>
    </div>
  </div>
</template>
<style scoped>
.page-main {
  background-color: var(--page-bgc);
  padding: 0 2%;
  min-height: 100vh;
}

.page-layouts {
  margin: 0 auto;
  max-width: 980px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: calc(100vh - 6rem);
}

.footer {
  height: 6rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
}
</style>
