<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { APIFile, APIFileList, APIFolder } from '@ftypes/api';
import { fileSizeFormat } from '@/unit/format/fileSizeFormat';
import { dateFormat } from '@/unit/format/dateFormat';
import FileTypeIcon from './FileTypeIcon.vue';
import MainBox from '@/unit/smallElements/MainBox.vue';
import ArrowDownSvg from '../icons/ArrowDownSvg.vue';
import type { ToDirFunction } from '@/views/FilesBrowesView.vue';
import ButtonLink from '@/unit/smallElements/ButtonLink.vue';


const props = defineProps<{ filelist: APIFileList, currentPath: string ,toDir:ToDirFunction}>()
const children = computed<APIFileList>(() => props.filelist);
function goto(f: APIFile | APIFolder) {
    const newpath = `${props.currentPath == '/' ? '' : props.currentPath}/${f.name}`;
    console.log("跳转到", newpath);
    if (f.type === 'folder') {
        props.toDir(newpath);
    } else if (f.type === 'file') {
        props.toDir(newpath, f);
    }
}


//排序
const sortType = ref<"name-asc" | "name-desc" | "size-asc" | "size-desc" | "item-asc" | "item-desc">();
const showChildren = computed(() => {
    if (sortType.value === "name-asc") {
        return [...children.value || []].sort((a, b) => {
            if (a.type == "folder" && b.type != "folder") {
                return -1
            }
            if (a.type != "folder" && b.type == "folder") {
                return 1
            }
            return a.name.localeCompare(b.name)
        });
    }
    if (sortType.value === "name-desc") {
        return [...children.value || []].sort((a, b) => {
            if (a.type == "folder" && b.type != "folder") {
                return 1
            }
            if (a.type != "folder" && b.type == "folder") {
                return -1
            }
            return b.name.localeCompare(a.name)
        });
    }
    if (sortType.value === "size-asc") {
        return [...children.value || []].sort((a, b) => {
            if (a.type == "folder" && b.type != "folder") {
                return -1
            }
            if (a.type != "folder" && b.type == "folder") {
                return 1
            }
            return (a.size || 0) - (b.size || 0)
        });
    }
    if (sortType.value === "size-desc") {
        return [...children.value || []].sort((a, b) => {
            if (a.type == "folder" && b.type != "folder") {
                return 1
            }
            if (a.type != "folder" && b.type == "folder") {
                return -1
            }
            return (b.size || 0) - (a.size || 0)
        });
    }
    if (sortType.value === "item-asc") {
        return [...children.value || []].sort((a, b) => {
            if (a.type == "folder" && b.type != "folder") {
                return -1
            }
            if (a.type != "folder" && b.type == "folder") {
                return 1
            }
            return (a.lastModified || 0) - (b.lastModified || 0)
        });
    }
    if (sortType.value === "item-desc") {
        return [...children.value || []].sort((a, b) => {
            if (a.type == "folder" && b.type != "folder") {
                return 1
            }
            if (a.type != "folder" && b.type == "folder") {
                return -1
            }
            return (b.lastModified || 0) - (a.lastModified || 0)
        });
    }
    return children.value;
});

//用于开关排序动画
const sortStart = ref(false);
watch(children, () => {
    sortStart.value = false;
});
watch(sortType, () => {
    sortStart.value = true;
});



</script>
<template>
    <MainBox>
        <div class="files" :class="{ 'sort-start': sortStart }">
            <!-- 表头-->
            <div class="th">
                <div class="thc t-name"
                    @click="sortType = sortType == 'name-asc' ? 'name-desc' : sortType == 'name-desc' ? undefined : 'name-asc'">
                    <span>名称</span>
                    <ArrowDownSvg class="sort-icon"
                        :class="{ asc: sortType == 'name-asc', desc: sortType == 'name-desc' }">
                    </ArrowDownSvg>
                </div>
                <div class="thc t-size"
                    @click="sortType = sortType == 'size-asc' ? 'size-desc' : sortType == 'size-desc' ? undefined : 'size-asc'">
                    <ArrowDownSvg class="sort-icon"
                        :class="{ asc: sortType == 'size-asc', desc: sortType == 'size-desc' }">
                    </ArrowDownSvg>
                    <span>大小</span>
                </div>
                <div class="thc t-up-item"
                    @click="sortType = sortType == 'item-asc' ? 'item-desc' : sortType == 'item-desc' ? undefined : 'item-asc'">
                    <ArrowDownSvg class="sort-icon"
                        :class="{ asc: sortType == 'item-asc', desc: sortType == 'item-desc' }">
                    </ArrowDownSvg>
                    <span>更新时间</span>
                </div>
            </div>
            <!--      行-->
            <TransitionGroup name="list">
                <ButtonLink class="td" v-for="file of showChildren" :key="file.name" @click="goto(file)">
                    <div class="t-name">
                        <FileTypeIcon class="file-icon" :fileType="file.type" :fileName="file.name" />
                        <span class="file-name" :title="file.name">{{ file.name }}</span>
                    </div>
                    <div class="t-size">{{ fileSizeFormat(file.size) }}</div>
                    <div class="t-up-item">{{ dateFormat(file.lastModified) }}</div>
                </ButtonLink>
            </TransitionGroup>
        </div>
    </MainBox>
</template>


<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: none;
}

.sort-start .list-move {
    transition: transform 0.25s ease;
}

.sort-icon {
    width: 1em;
    height: 1em;
    opacity: 0;
    transform: translateY(0.1em) rotate(0deg);
    color: var(--f-color-1);
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.thc {
    cursor: pointer;
}

.thc:hover .sort-icon {
    opacity: 0.5;
}

.thc .sort-icon.asc {
    transform: translateY(0.1rem) rotate(-135deg);
    opacity: 1;
}

.thc .sort-icon.desc {
    transform: translateY(0.1rem) rotate(45deg);
    opacity: 1;
}

@media (min-width: 768px) {
    .th .t-size {
        border-right: 0.2rem solid rgba(0, 0, 0, 0);
        padding-right: 0.5rem;
        transition: border-right-color 0.25s ease;
    }

    .th:hover .t-size {
        border-right: 0.2rem solid var(--main-border-c);
    }
}

.th .t-name {
    border-right: 0.2rem solid rgba(0, 0, 0, 0);
    padding-right: 0.5rem;
    transition: border-right-color 0.25s ease;
}

.th:hover .t-name {
    border-right: 0.2rem solid var(--main-border-c);
}

.th .t-name,
.th .t-size,
.th .t-up-item {
    font-weight: bold;
    color: var(--f-color-1);
    align-items: center;
    flex-direction: row;
    gap: 0.4rem;

}

.th .t-size,
.th .t-up-item {
    justify-content: flex-end;
}

.th .t-size {
    display: flex;
}

.td .t-size,
.td .t-up-item {
    font-size: 0.9rem;
    color: var(--f-color-1);
}

.td {
    gap: 0.6rem;
}

.file-name {
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
}

.files {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.th,
.td {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.th {
    padding: 0 0.4rem 0.4rem 0.4rem;
}

.t-name {
    flex: 1;
    width: 0rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.file-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.t-size {
    text-align: right;
    min-width: 5rem;
}

.t-up-item {
    display: none;
    flex: 0.3;
    text-align: right;
    min-width: 10rem;
}

@media (min-width: 768px) {
    .t-up-item {
        display: block;
    }

    .th .t-up-item {
        display: flex;
    }
}
</style>
