<script setup lang="ts">
import { previewComponents, type ViewComponent } from "@/unit/filePreview";
import MainBox from "@/unit/smallElements/MainBox.vue";
import type { APIFile } from "@ftypes/api";
import { computed, ref, shallowRef, watch } from "vue";
import BriwesLoading from "./BriwesLoading.vue";
import { serverApiBrowse } from "@/unit/serverApi/browse";

const props = defineProps<{ file: APIFile ,currentPath:string }>()

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
    <MainBox v-else>
        <div>
            <select v-model="selectEd" v-if="viewComponents.length > 1">
                <option v-for="(co, index) of viewComponents" :value="index">{{ co.viewComponent.lable }}</option>
            </select>
            <component :is="selectedComponent!.viewComponent.component" :file="props.file"
                :previewInfo="selectedComponent!.info"></component>
        </div>
    </MainBox>
</template>

<style scoped></style>