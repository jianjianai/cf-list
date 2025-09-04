<script setup lang="ts">
import { dateFormat } from '@/unit/format/dateFormat';
import { fileSizeFormat } from '@/unit/format/fileSizeFormat';
import { putNotification } from '@/unit/notification/notification';
import type { APIFile } from '@ftypes/api.js';
import { ref, onMounted, onUnmounted } from 'vue';
import type { URLPreviewInfo } from '..';
import 'aplayer/dist/APlayer.min.css';
import coverUrl from "@/unit/fileTypesSvg/file-music-fill.svg?url";
// @ts-ignore
import APlayer from 'aplayer';


const props = defineProps<{ file: APIFile, previewInfo: URLPreviewInfo }>()

const aplayerEl = ref<HTMLElement>()
let aplayer:any = null;
let unmounted = true;
onMounted(()=>{
  aplayer = new APlayer({
    container: aplayerEl.value,
    audio: [{
      name: props.file.name,
      url: props.previewInfo.url,
      cover: coverUrl,
      artist: dateFormat(props.file.lastModified)+" - "+fileSizeFormat(props.file.size),
    }],
    theme: '#56ccff'
  });
  aplayer.on('error', function () {
    if(unmounted){
      putNotification({message:"音频加载失败！",type:"error",timeOut:10000});
    }
  });
})
onUnmounted(()=>{
  unmounted = false;
  aplayer?.destroy()
});


</script>

<template>
  <div class="music">
    <div ref="aplayerEl"></div>
  </div>
</template>

<style scoped>
.music{
  padding: 1rem 0;
}
</style>