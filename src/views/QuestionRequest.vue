<template>
<van-nav-bar :title="t('QuestionRequest.HeadResQ')" class="my-head-title" safe-area-inset-top />
<div v-if="loading" class="pdb4" safe-area-inset-top>
    <div class="box question-requestion">
        <div class="box-landscape-questionR-l">
            <div class="head">
                <p>{{subject['title']}}</p>
                <p class="ptime">{{regTime}}</p>
            </div>
            <div class="role-name">
                <span class="ml10">{{t('QuestionRequest.NickName')}}:</span>
                <span class="sp1"><span class="sp2">{{subject['nickname']}}</span></span>
            </div>
            <div v-if="showBtmBtn" class="box-landscape-question-btn">
                <van-button  size="small" type="primary" class="mr10" @click="resolveQ">{{t('QuestionRequest.Solved')}}</van-button>
                <van-button  plain hairline size="small" type="primary" @click="continueQ">{{t('QuestionRequest.KeepAsking')}}</van-button>
            </div>
        </div>
        <div class="cont box-landscape-questionR-r">
            <div v-for="(v,k) in list" :key="k" class="br">
               <template v-if="!v['gmid']">
                   <div class="flex-box">
                       <div class="user-tx">
                           <div><van-icon name="manager" size="1.2rem"/></div>
                       </div>
                       <div class="user-cont">
                            <div>{{v['content']}}</div>
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
                            <div class="mt10 question-requestion-flex">
                                <template v-if="v['video']">
                                    <template v-if="v['video']!==null && v['video']['length']!==0">
                                        <div class="re-video">
                                            <span class="sp1_video">video</span>
                                            <van-icon name="video-o" size="3rem" color="#d5d5d5" />
                                        </div>
                                    </template>
                                </template>
                            </div>
                            <div class="vtime">{{MomentJs.unix(v['updated_at']).format("YYYY-MM-DD HH:mm:ss")}}</div>
                        </div>
                   </div>
               </template>
               <template v-else>
                   <div class="flex-box-2">
                       <div class="serv-cont">
                            <div v-html="v['content']" />
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
                       <div class="vtime">{{MomentJs.unix(v['updated_at']).format("YYYY-MM-DD HH:mm:ss")}}</div>
                       </div>
                        <div class="serv-tx">
                            <div><van-icon name="service" size="1.2rem" color="#ff5252"/></div>
                       </div>
                   </div>
               </template>
            </div>
        </div>
    </div>
</div>
<PullRefresh :loading="loading3" v-model:loading2="loading2" :onRefresh="onRefresh"/>
<van-image-preview v-model:show="showImages" :images="imagesPw" />
<van-sticky v-if="showBtmBtn" :offset-bottom="10" position="bottom" class="question-request-btm-button" safe-area-inset-bottom>
    <van-button  size="small" type="primary" class="mr10" @click="resolveQ">{{t('QuestionRequest.Solved')}}</van-button>
    <van-button  plain hairline size="small" type="primary" @click="continueQ">{{t('QuestionRequest.KeepAsking')}}</van-button>
</van-sticky>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue'
import { useI18n } from "vue-i18n";
import {SDK_VALUE,requestGet}  from '../utils/request'
import {Api} from '../config/api'
import Moment from 'moment'
import {Toast,Dialog}  from 'vant'
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
let _params:any = ref()
    SDK_V.then((v:any)=>{
        if(v.guid){
           _params ={
                id:route.params.id,
                uid:v.guid
           }
        }
        else{
            _params ={
                id:route.params.id
            }
        }
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
                id:route.params.id,
                typeid:route.params.typeid,
                isreply:1
            }
    })
}

const resolveQ = ()=>{
        Dialog.confirm({
        confirmButtonText: t('QuestionRequest.Sure'),
        cancelButtonText: t('QuestionRequest.Cancel'),
        message:t('QuestionRequest.resQ')})
        .then(() => {
            let data = null
            if(_params.uid){
                data={
                    gmscore:subject.value.gm_score,//获取分数
                    gamescore:subject.value.game_score, //获取分数
                    id:subject.value.id,  //获取sbujectid
                    uid:_params.uid
                }
            }
            else{
                data={
                    gmscore:subject.value.gm_score,//获取分数
                    gamescore:subject.value.game_score, //获取分数
                    id:subject.value.id  //获取sbujectid
                }
            }
            let _url = Api.CLOSE_QUESTION
            requestGet(_url,data).then((res:any)=>{
                if(res.data.code == 0){
                    Toast({
                        overlay:true,
                        icon:'success',
                        message:t('QuestionRequest.Success'),
                        forbidClick: true,
                        className:'submit-question-alt',
                        duration:2000
                    });
                    setTimeout(() => {
                        router.push('/MyQuestion')
                    }, 2500);
                }
            }).catch((e:any)=>{
                Toast.loading({
                    overlay:true,
                    message:e.message,
                    forbidClick: true,
                    duration:3000
                });
            })
        })
        .catch(() => {
            // on cancel
        });
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
.pdb4{
    padding: 0
}
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
    position: relative;
}
.head{
    padding: 10px;
    text-align: center;
    font-weight: 700;
    border-radius: 5px;
    .ptime{
        margin-top: 10px;
        font-size: 12px;
        color:#a9a9a9;
        font-weight: normal;
    }
}
.role-name{
    font-size: 12px;
    position: relative;
}
.vimg{
    max-width: calc(50vw/2);
}
.cont{
    width: 100%;
    position: relative;
    word-break: break-word;
    font-size: 14px;
    background: #efefef;
}
.sp1{
    text-align: left;
    /* padding: 10px; */
    display: inline-block;
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 5px;
    line-height: 1.4rem;
}
.sp2{
    margin-left: 5px;
    font-size: 0.875rem;
}
.vtime{
    margin: 10px 0 0px 0;
    font-size: 12px;
    text-align: right;
    color: #a9a9a9;
}
.br{
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
}
.question-requestion-flex{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: flex-end;
    justify-content: flex-start;
}
.google-t{
    background: #fdffde;
    padding: 0.13rem;
    border: 1px solid #d7d7d7;
    border-radius: 5px;
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
.re-video{
    border: 1px solid #ebebeb;
    border-radius: 5px;
    .sp1_video{
        font-size: 12px;
        z-index: 1;
        background: #efefef;
        width: 3rem;
        display: block;
        text-align: center;
        color: #aba3a3;
    }
}
.flex-box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: baseline;
}
.flex-box-2{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-end;
    align-items: flex-start;
}
.user-tx,.serv-tx{
    width: 8%;
    background: #fff;
    text-align: center;
    height: 8%;
    color: #006edd;
    border-radius: 5px;
}
.user-cont,.serv-cont{
        /* width: 100%; */
    margin-left: 10px;
    /* max-width: 99%; */
    background: #fff;
    width: 83%;
    /* border: 1px solid #006edd00; */
    padding: 10px;
    border-radius: 5px;
    position: relative;
    word-break: break-all;
}
.serv-cont{
    margin-left: 0;
    margin-right: 10px;
    background: #fffcf8;
}
.serv-tx{
    background: #fffcf8;
}

.box-landscape-question-btn{
    display: none;
}
</style>