<script setup lang="ts">
import { previewComponents, type ViewComponent } from "@/unit/filePreview";
import MainBox from "@/unit/smallElements/MainBox.vue";
import type { APIFile } from "@ftypes/api";
import { computed, ref, shallowRef, watch } from "vue";
import BriwesLoading from "./BriwesLoading.vue";
import { serverApiBrowse } from "@/unit/serverApi/readFile";

const props = defineProps<{ file: APIFile, currentPath: string }>()

const viewComponents = shallowRef<{ viewComponent: ViewComponent<unknown>, info: unknown }[]>()
watch(() => props.file, async () => {
    viewComponents.value = undefined;
    if (props.file.type !== "file") {
        return;
    }
    let previewInfos = props.file.previewInfos;
    if (!previewInfos) {
        previewInfos = await serverApiBrowse.previewInfos(props.currentPath) || [];
    }
    if (previewInfos.length === 0) {
        console.warn("没有预览信息", props.file);
        return;// TODO 显示没有预览的提示
    }
    const f: { viewComponent: ViewComponent<unknown>, info: unknown }[] = [];
    for (const info of previewInfos) {
        const v = previewComponents[info.type];
        if (!v) {
            continue;
        }
        f.push({ viewComponent: v, info: info.previewInfo });
    }
    viewComponents.value = f;
}, { immediate: true });


const selectEd = ref(0);
const selectedComponent = computed(() => {
    if (!viewComponents.value || viewComponents.value.length === 0) {
        return null;
    }
    return viewComponents.value[selectEd.value];
});

</script>

<template>
    <BriwesLoading v-if="!viewComponents"></BriwesLoading>
    <MainBox class="main-box box" v-else>
        <div class="upline" v-if="viewComponents.length > 1">
            <div class="item" :class="{selected:selectEd==index}" v-for="(co, index) of viewComponents" :value="index" @click="selectEd = index">{{
                co.viewComponent.lable }}</div>
        </div>
        <div class="file-preview">
            <component :is="selectedComponent!.viewComponent.component" :file="props.file"
                :previewInfo="selectedComponent!.info"></component>
        </div>
    </MainBox>
</template>

<style scoped>
.file-preview {
    padding: 0 0.8rem 0.8rem 0.8rem;
}

.main-box.box {
    padding: 0;
    margin: 0;
    overflow: hidden;
}

.upline {
    background-color: var(--upline-color);
    width: 100%;
    height: 2.8rem;
    display: flex;
    border-radius: 0.8rem 0.8rem 0 0;
    flex-wrap: nowrap;
    align-items: flex-end;
}

.item {
    padding: 0 0.8rem;
    cursor: pointer;
    font-size: 0.9rem;
    height: 2.8rem;
    text-align: center;
    line-height: 2.8rem;
    border-radius: 0.5rem 0.5rem 0 0;
    position: relative;
}

.item.selected {
    background-color: var(--mian-box-bgc);
}
.item.selected::after{
    content: '';
    position: absolute;
    bottom: 0;
    left: -0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    background: radial-gradient(1rem at left top, transparent 50%, var(--mian-box-bgc) 50%);
}
.item.selected::before{
    content: '';
    position: absolute;
    bottom: 0;
    right: -0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    background: radial-gradient(1rem at right top, transparent 50%, var(--mian-box-bgc) 50%);
}

</style>