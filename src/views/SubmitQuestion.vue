<template>
<van-nav-bar :title="t('SubmitQuestion.HeadSubmit')" class="my-head-title" safe-area-inset-top />
<div class="pdb4 submit-question-flex">
    <van-form>
        <van-cell-group>
            <van-field
                v-model="textareaValue"
                rows="2"
                autosize
                clearable
                colon
                required
                :label="t('SubmitQuestion.ProblemDescription')"
                type="textarea"
                maxlength="1000"
                placeholder="请输入留言"
                show-word-limit
            />
            <van-field name="uploader" :label="t('SubmitQuestion.UploadImage')">
                <template #input>
                    <van-uploader v-model="fileList" multiple :max-count="3" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg,video/mp4,video/mov,video/3gpp,video/mp4eg"/>
                </template>
            </van-field>
        </van-cell-group>
        <div class="radius-3-vant-btn">
            <van-button block type="primary" class="mt10" @click="submitVerify">提交</van-button>
        </div>
    </van-form>
</div>
</template>
<script lang="ts" setup>
import { ref,onMounted,reactive } from 'vue'
import { useI18n } from "vue-i18n";
import {SDK_VALUE,requestPost}  from '../utils/request'
import {exURL}  from '../utils/index'
import PnSDK  from '../utils/pnsdk'
import {Api} from '../config/api'
import {Toast,Dialog }  from 'vant'
import {useRoute,useRouter } from 'vue-router'

const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const SDK_V:any = SDK_VALUE()
const textareaValue = ref('')
const fileList = ref<any[]>([])
const SDK_RESULT:any = ref<any[]>([])
let _version = exURL("version")
let _params:any = ref<any[]>([])
let fd= new FormData()


     _params ={
        id:route.params.id,
        typeid:route.params.typeid,
        isreply: route.params.isreply
    }
    SDK_V.then((v:any)=>{
        if(v.guid){
           _params['uid'] = v.guid
        }
        
        SDK_RESULT.value = v
        Toast.clear()
    }).catch((e:any)=>{
        Toast.loading({
            overlay:true,
            icon: 'fail',
            message:e,
            className: 'sdkerror',
            forbidClick: true,
            duration:5000
        });
    })


const submitVerify = ()=>{
    if(textareaValue.value.length<=0){
        Toast({
            message:t('SubmitQuestion.Description'),
            position:'top',
            duration:2000
        })
        return
    }
    else{
        if(fileList.value.length!==0){
            let images = fileList.value.filter((v)=>{return v.file.type.includes('image')})
            let videos = fileList.value.filter((v)=>{return v.file.type.includes('video')})
            if(images.length>2){
                Toast({
                    message: t('SubmitQuestion.TwoImages'),
                    position: 'top'
                });
                return
            }
            else if(videos.length>1){
                Toast({
                    message: t('SubmitQuestion.Video'),
                    position: 'top'
                });
                return
            }
            else if(videos.length!==0 && Math.ceil(videos[0].file.size/1024) > 51200){
                Toast({
                    message: t('SubmitQuestion.Max'),
                    position: 'top'
                });
                return
            }
            else if(images.length===0 || videos.length === 0){
                Toast({
                    message: t('SubmitQuestion.Files'),
                    position: 'top'
                });
                return
            }
            else{
                if(images.length>0){
                    for(const [index,item] of images.entries()){
                        fd.append(`file${index+1}`,item.file)
                    }
                }
                if(videos.length>0){
                    for(const item of videos){
                        fd.append(`file_v`,item.file)
                    }
                }
                submitQ()
            }
        }
        else{
           submitQ()
        }
    }
}

const submitQ = ()=>{
    let v:any = SDK_RESULT.value
    let textV:string = textareaValue.value
    if(_params.isreply!=='-1'){
        fd.append("body",textV)
        fd.append("id",_params.id)
    }
    else{
        let sdkobj = JSON.parse(v.sdks)
        sdkobj.version = _version
        let sdkstring = JSON.stringify(sdkobj)
        fd.append("body",textV)
        fd.append("appid",v.appid)
        fd.append("l",v.language)
        fd.append("srvid",v.srvid)
        fd.append("nickname",v.nickname) //(null)
        fd.append("qtype",_params.typeid)
        fd.append("sdkParameters", sdkstring)
    }
    sendData(fd)
}

const sendData = (v:Object) =>{
    let _url = ''
    let replyUrl = Api.REPLY_QUESTION
    let createUrl = Api.CREATE_QUESTION
    if(_params.isreply!=='-1'){
        if(_params.uid){
            replyUrl+=`?uid=${_params.uid}`
        }
        _url = replyUrl
    }
    else{
        if(_params.uid){
            createUrl+=`?uid=${_params.uid}`
        }
        _url = createUrl
    }

    requestPost(_url,v,30000).then((res:any)=>{
        if(res.data.code===0){
            Toast({
                message:t('SubmitQuestion.Success2'),
                icon:'success',
                duration:2000,
                className:"submit-question-alt"
            })
            if(_params.isreply!=='-1'){
                setTimeout(() => {
                    router.go(-1)
                }, 3000);
            }
            else{
                let SDK_FCMENABLED:any = SDK_RESULT.value
                if (!SDK_FCMENABLED.fcmenabled) {
                    setTimeout(() => {
                        Dialog.alert({
                        message: t('SubmitQuestion.PushMessage'),
                    }).then(() => {
                        PnSDK.fcm(true)
                        router.push({
                            path: '/'
                        })
                    });
                    }, 3000);

                }
            }
        }
        else{
         Toast({
            overlay:true,
            message:res.data.code,
            forbidClick: true,
            duration:3000
        });   
        }
    }).catch((e:any)=>{
        Toast.loading({
            overlay:true,
            message:e.message,
            forbidClick: true,
            duration:3000
        });
    })
}
</script>
<style lang="less" scoped>
.my-head-title {
    padding-left: 10px;
}
</style>