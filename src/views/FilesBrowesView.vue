<script setup lang="ts">
import BriwesFolder from '@/components/filesBrowe/BriwesFolder.vue';
import BrowesBreadcrumb from '@/components/filesBrowe/BrowesBreadcrumb.vue';
import BrowesContent from '@/components/filesBrowe/BrowesContent.vue';
import BrowesPageHeader from '@/components/filesBrowe/BrowesPageHeader.vue';
import ButtonLink from '@/unit/smallElements/ButtonLink.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const content = ref("## 欢迎使用 CFList 文件浏览器");
const filePath = computed(() => `/${Array.isArray(route.params.path) ? route.params.path.join("/") : ""}`);

</script>

<template>
  <div class="page-main">
    <div class="page-layouts">
      <BrowesPageHeader></BrowesPageHeader>
      <BrowesBreadcrumb></BrowesBreadcrumb>
      <BriwesFolder></BriwesFolder>
      <BrowesContent v-if="content" :content="content" style="padding: 1rem"></BrowesContent>
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
