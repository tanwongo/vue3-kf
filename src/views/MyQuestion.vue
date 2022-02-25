<template>
<van-nav-bar :title="t('MyQuestion.HeadMyQ')" class="my-head-title" safe-area-inset-top />
<div class="pdb4">
    <div v-for="(v,k) in list" :key="k">
        <div class="my-question-c">
            <van-button type="default" @click="questionRequest(v)">
                <div class="flex-box">
                    <div>
                        <template v-if="v.status !== 3 || v.status !== 10 || v.status !== 11">
                            <span class="txt">{{v.title}}<van-image width="1rem" height="1rem" class="cimg" fit="contain" src="/src/assets/exchange.png"/></span>
                        </template>
                        <template v-else>
                            <span class="txt">{{v.title}}<van-image width="1rem" height="1rem" class="cimg" fit="contain" src="/src/assets/complete.png"/></span>
                        </template>
                    </div>
                    <div class="time">{{MomentJs.unix(v.updated_at).format("YYYY-MM-DD HH:mm:ss")}}</div>
                </div>
            </van-button>
        </div>
    </div>
    <div v-if="noQuestion" class="noQuestion">
        <p>{{t('MyQuestion.createOne')}}</p>
        <van-button icon="comment-o" type="primary" @click="submitQuestion()">{{t('MyQuestion.create')}}</van-button>
    </div>
</div>
</template>
<script lang="ts" setup>
import { defineComponent,ref,onMounted } from 'vue'
import { useI18n } from "vue-i18n";
import {SDK_VALUE,requestGet}  from '../utils/request'
import {Api} from '../config/api'
import Moment from 'moment'
import {Toast}  from 'vant'
import {useRouter } from 'vue-router'
import { json } from 'stream/consumers';

const { t } = useI18n();
const list = ref([])
const MomentJs = Moment
const router = useRouter()
const SDK_V:any = SDK_VALUE()
const noQuestion = ref(false)


SDK_V.then((v:any)=>{
    let _url = Api.MY_QUESTION
    if(v.guid){
        _url +="?uid="+v.guid
    }
    requestGet(_url).then((res:any)=>{
            if(res.data.data.length===0 && res.data.code === 0){
                noQuestion.value = true
            }
            else{
                list.value = res.data.data
            }
            Toast.clear()
    }).catch((e:any)=>{
        Toast.loading({
            overlay:true,
            message:e.message,
            forbidClick: true,
            duration:0
        });
    })
})


const questionRequest = (v:any)=> {
       router.push({
            name:"QuestionRequest",
            params:{
                id:v.id,
                typeid:v.typeid
            }
        })
}

const submitQuestion = ()=> {
    router.push({
        name:"SubmitQuestion",
        params:{
            id:-1,
            typeid:0,
            isreply:-1
        }
    })
}

</script>
<style lang="less" scoped>
.my-head-title {
    padding-left: 10px;
}
.my-question-c{
    position: relative;
    margin-bottom: 10px;
    border-radius: 5px;
    .txt{
        display: inline-block;
    }
    .cimg{
        vertical-align: bottom;
        margin-left: 10px;
    }
    .time{
        font-size: 12px;
        text-align: right;
    }
}
.noQuestion{
        text-align: center;
}
.flex-box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
}
</style>