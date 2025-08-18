<script setup lang="ts">
import { getPreviewComponents, type ViewComponent } from "@/unit/filePreview";
import MainBox from "@/unit/smallElements/MainBox.vue";
import type { APIFile } from "@ftypes/api";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{ file: APIFile }>()

const viewComponents = computed<ViewComponent[]>(() => {
    return getPreviewComponents(["download"]);
});

const selectEd = ref(0);

</script>

<template>
    <MainBox>
        <div>
            <select v-model="selectEd" v-if="viewComponents.length > 1">
                <option v-for="(co, index) of viewComponents" :value="index">{{ co.name }}</option>
            </select>
            <component :is="viewComponents[selectEd].component" :file="props.file"></component>
        </div>
    </MainBox>
</template>

<style scoped></style>