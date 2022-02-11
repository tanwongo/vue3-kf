<template>
<van-nav-bar :title="t('hello').replace('$uid', '\n' + uid + '\n')" class="home-my-title" safe-area-inset-top>
    <template #left>
        <div class="br-radius"><van-icon name="manager" class="home-my-title-icon" color="#e5d1b8" /></div>
    </template>
</van-nav-bar>
<div class="pdb4">
    <div class="home-my-servebtn">
        <van-button type="default">服务记录<van-icon name="arrow" /></van-button>
    </div>
</div>
</template>
<script lang="ts" setup>
import { defineComponent,ref } from 'vue'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const uid = ref(12345)
</script>
<style lang="less" scoped>
.home-my-title {
    background: url(/src/assets/head-q.jpg) repeat 0 0 #3f3f47;
    .br-radius{
        width: 23px;
        height: 23px;
        border: 1px solid #e5d1b8;
        border-radius: 50%;
    }
}
.home-my-servebtn{
    position: relative;
}
</style>