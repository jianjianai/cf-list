<script setup lang="ts">
import { putNotification } from '@/unit/notification/notification';
import type { APIFile } from '@ftypes/api';
import { ref, onMounted } from 'vue';
import type { URLPreviewInfo } from '..';
import LoadError from '@/unit/smallElements/LoadError.vue';
import Loading from '@/unit/smallElements/Loading.vue';
import PDF from "pdf-vue3";
import '../css/PdfVue3PDFPreview.css';



const props = defineProps<{ file: APIFile, previewInfo: URLPreviewInfo }>()
const pdfData = ref<Uint8Array>();
const pdfLoadError = ref(false)
onMounted( async ()=>{
  try{
    const res = await fetch(props.previewInfo.url);
    if(!res.ok){
      putNotification({message:"加载 pdf 文件失败!",type:"error",timeOut:10000});
      return;
    }
    const data = await res.arrayBuffer();
    pdfData.value = new Uint8Array(data);
  }catch (e){
    pdfLoadError.value = true;
  }
});

</script>

<template>
  <div class="pdf">
    <div v-if="pdfData" class="pdf-body"><PDF :src="pdfData"/></div>
    <LoadError v-else-if="pdfLoadError" message="加载 pdf 文件失败!"></LoadError>
    <Loading v-else></Loading>
  </div>
</template>

<style scoped>
.pdf-body{
  border: var(--pdf-player-border);
  border-radius: 0.8rem;
  padding: 0.8rem 0;
  height: 70vh;
}
.pdf{
  padding: 1rem 0;
}
</style>