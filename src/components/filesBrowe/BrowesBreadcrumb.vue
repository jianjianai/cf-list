<script setup lang="ts">
import ButtonLink from "@/unit/smallElements/ButtonLink.vue";
import {computed} from "vue";

const props = defineProps<{ currentPath: string }>();

const pathArray = computed(()=>{
  const s = props.currentPath.split("/").filter(Boolean);
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
    <ButtonLink class="alink" :to="getToPath(index)">{{file}}</ButtonLink>
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