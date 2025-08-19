<script setup lang="ts">
import MainBox from '@/unit/smallElements/MainBox.vue';


</script>

<template>
    <MainBox>
        <!-- 文件不存在 -->
        <div class="no-file">
            <!-- 一个问号 -->
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 34h0" stroke="#bbb" stroke-width="4" stroke-linecap="round"/>
                <path d="M24 30v-2c0-3 6-4 6-10 0-3.3-2.7-6-6-6s-6 2.7-6 6" stroke="#bbb" stroke-width="4" fill="none" stroke-linecap="round"/>
            </svg>
            <p>文件或文件夹不存在</p>
        </div>
    </MainBox>
</template>

<style scoped>
.no-file {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 8rem;
}
svg {
    width: 4rem;
    transform-origin: center;
    animation: rotate 2s linear infinite;
}
path {
    fill: none;
    stroke: var(--tip-color-warning);
    stroke-width: 4;
    stroke-linecap: round;
}
</style>