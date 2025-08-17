<script setup lang="ts">
import ButtonLink from "@/unit/smallElements/ButtonLink.vue";
import {computed} from "vue";
import { useRoute } from "vue-router";

const router = useRoute();
const pathArray = computed(()=>{
  const s = router.path.split("/");
  s.splice(0,1);
  s.splice(s.length-1, 1);
  return s;
});

function getToPath(index: number) {
  let toPath = '/';
  for (let i = 0; i <= index; i++) {
    toPath += `${pathArray.value[i]}/`;
  }
  return toPath;
}


</script>

<template>
<div class="breadcrumb">
  <ButtonLink to="/">主页</ButtonLink>
  <template v-for="(file,index) of pathArray">
    <div>/</div>
    <ButtonLink class="alink" :to="getToPath(index)">{{decodeURI(file)}}</ButtonLink>
  </template>
</div>
</template>

<style scoped>
.alink{
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.breadcrumb{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>