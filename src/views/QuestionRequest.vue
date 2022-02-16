<template>
<van-nav-bar :title="t('HeadResQ')" class="my-head-title" safe-area-inset-top />
<div v-if="loading" class="pdb4">
    <div class="box">
        <div class="head">
            <p>{{subject['title']}}</p>
            <p class="ptime">{{regTime}}</p>
        </div>
        <div class="role-name">
            <span class="sp1"><van-icon name="user-o" /><span class="ml5">{{t('NickName')}}</span>：<span class="sp2">{{subject['nickname']}}</span></span>
        </div>
        <div class="cont">
            <div v-for="(v,k) in list" :key="k" class="br">
               <template v-if="!v['gmid']">
                   <div>
                       <div><van-icon name="user-circle-o" size="1rem" /></div>
                       <div class="cont">{{v['content']}}</div>
                       <div v-if="v['images']" class="mt10 question-requestion-flex">
                           <template v-if="v['images'] !==null || v['images']['length'] !==0">
                                 <template v-for="(img,i) in v['images']" :key="i">
                                          <van-image
                                            fit="cover"
                                            position="left"
                                            class="vimg"
                                            :src="Api.IMAGES_CDN+'/'+img"
                                            @click="showImg(Api.IMAGES_CDN+'/'+img)"
                                            >
                                            <template v-slot:error>
                                                <p><van-icon name="photo-fail" size="64" /></p>
                                            </template>
                                          </van-image>
                                 </template>
                           </template>
                       </div>
                   </div>
               </template>
               <template v-else>
                   <div>
                       <div><van-icon name="service" size="1rem" color="#2196f3"/></div>
                       <div class="cont" v-html="v['content']" />
                       <template v-if="v['translated']"><div class="google-t" v-html="v['translated']" /></template>
                       <div v-if="v['images']" class="mt10 question-requestion-flex">
                           <template v-if="v['images'] !==null || v['images']['length'] !==0">
                                 <template v-for="(img,i) in v['images']" :key="i">
                                          <van-image
                                            fit="cover"
                                            position="left"
                                            class="vimg"
                                            :src="Api.IMAGES_CDN+'/'+img"
                                            @click="showImg(Api.IMAGES_CDN+'/'+img)"
                                            >
                                            <template v-slot:error>
                                                <p><van-icon name="photo-fail" size="64" /></p>
                                            </template>
                                          </van-image>
                                 </template>
                           </template>
                       </div>
                   </div>
               </template>
               <div class="vtime">{{MomentJs.unix(v['updated_at']).format("YYYY-MM-DD HH:mm:ss")}}</div>
            </div>
        </div>
    </div>
</div>
<PullRefresh :loading="loading3" v-model:loading2="loading2" :onRefresh="onRefresh"/>
<van-image-preview v-model:show="showImages" :images="imagesPw" />
<van-sticky v-if="showBtmBtn" :offset-bottom="10" position="bottom" class="question-request-btm-button" safe-area-inset-bottom>
    <van-button  plain hairline size="small" type="primary" class="mr10" @click="continueQ">{{t('Solved')}}</van-button>
    <van-button  plain hairline size="small" type="primary" @click="resolveQ">{{t('KeepAsking')}}</van-button>
</van-sticky>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue'
import { useI18n } from "vue-i18n";
import {SDK_VALUE,requestGet}  from '../utils/request'
import {Api} from '../config/api'
import Moment from 'moment'
import {Toast}  from 'vant'
import {useRoute,useRouter } from 'vue-router'
import PullRefresh from '@/components/PullRefresh.vue'

const { t } = useI18n();
const list = ref([])
const subject:any = ref({})
const MomentJs = Moment
const route = useRoute()
const router = useRouter()
let regTime:any = ref('')
let loading = ref(false)
let loading2= ref(false)
let loading3 = ref(false)
const _data = ref({})
const showImages = ref(false)
const showBtmBtn = ref(false)
const imagesPw = ref<any[]>([])
const SDK_V:any = SDK_VALUE()

onMounted(async () => {
    let _params ={
        id:1,
        uid:2000
    }
    // SDK_V.then((v:any)=>{
    //     if(v.guid){
    //        _params ={
    //             id:route.params.id,
    //             uid:v.guid,
    //             vtime:new Date().getTime()
    //        }
    //     }
    //     else{
    //         _params ={
    //             id:route.params.id,
    //             vtime:new Date().getTime()
    //         }
    //     }
    //         getData(_params)
    // })
     getData(_params)
})
const getData = (v:Object) =>{
    requestGet(Api.DETAIL_QUESTION,v).then((res:any)=>{
        list.value = res.data.data.list
        subject.value = res.data.data.subject
        regTime.value = MomentJs.unix(subject.value['updated_at']).format("YYYY-MM-DD HH:mm:ss")
        showBtmBtn.value = true
        loading.value = true
        loading3.value = false
        Toast.clear()
    }).catch((e:any)=>{
        Toast.loading({
            overlay:true,
            message:e.message,
            forbidClick: true,
            duration:3000
        });
        loading.value= false
        loading3.value = true
        showBtmBtn.value = false
    })
}

const continueQ = ()=>{
    router.push({
            name:"SubmitQuestion",
            params:{
                id:1,
                typeid:2000,
                isreply:1
            }
    })
}

const resolveQ = ()=>{

}

const onRefresh = ()=>{
    setTimeout(() => {
        loading3.value = !loading3.value
        loading2.value = false
        getData(_data.value)
    }, 1000);
}

const showImg = (v:any)=>{
    imagesPw.value = []
    imagesPw.value.push(v)
    showImages.value = true
}
</script>
<style lang="less" scoped>
.my-head-title {
    padding-left: 10px;
}
p{
    margin:0;
    padding: 0;
}
.disline{
    display: inline-block;
}
.box{
    padding: 0 10px;
    position: relative;
}
.head{
    padding: 10px;
    text-align: center;
    font-weight: 700;
    border-radius: 3px;
    background: #fff;
    .ptime{
        margin-top: 10px;
        font-size: 12px;
        font-weight: 100;
    }
}
.role-name{
    position: relative;
    margin: 10px 0
}
.vimg{
    max-width: calc(100vw/2);
}
.cont{
    position: relative;
    word-break: break-word;
    margin-top: 10px;
    font-size: 14px;
}
.sp1{
    background: #fff;
    text-align: left;
    /* padding: 10px; */
    display: inline-block;
    padding: 3px 5px;
    font-size: 14px;
    border-radius: 3px;
    line-height: 1.4rem;
}
.sp2{
    margin-left: 5px;
    font-size: 12px;
}
.vtime{
    margin: 10px 0 2px 0;
    font-size: 12px;
    text-align: right;
    color: #808080;
    position: absolute;
    bottom: 0;
    right: 5px;
}
.br{
    background: #fffcf4;
    border-radius: 3px;
    padding: 10px;
    margin-bottom: 10px;
    min-height: 175px;
    position: relative;
}
.question-requestion-flex{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    align-items: flex-end;
}
.google-t{
    background: #fdffde;
    padding: 0.13rem;
    border: 1px solid #d7d7d7;
    border-radius: 3px;
    box-shadow: 0px 0px 3px 2px #e6e6e6;
    font-size: 12px;
    margin-top: 10px;
    p{
        font-size: 12px !important;
    }
    span{
        font-size: 12px !important;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
        word-spacing: normal;
        color: #001994 !important;
    }
}
</style>