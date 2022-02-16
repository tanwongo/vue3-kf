<template>
<van-nav-bar :title="t('HeadSubmit')" class="my-head-title" safe-area-inset-top />
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
                :label="t('ProblemDescription')"
                type="textarea"
                maxlength="1000"
                placeholder="请输入留言"
                show-word-limit
            />
            <van-field name="uploader" :label="t('UploadImage')">
                <template #input>
                    <van-uploader v-model="fileList" multiple :max-count="3" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg,video/mp4,video/mov,video/3gpp,video/mp4eg"/>
                </template>
            </van-field>
        </van-cell-group>
        <div class="radius-3-vant-btn">
            <van-button block type="primary" class="mt10" @click="submitQ">提交</van-button>
        </div>
    </van-form>
</div>
<PullRefresh :loading="loading3" v-model:loading2="loading2" :onRefresh="onRefresh"/>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue'
import { useI18n } from "vue-i18n";
import {SDK_VALUE,requestGet}  from '../utils/request'
import {Api} from '../config/api'
import {Toast}  from 'vant'
import {useRoute,useRouter } from 'vue-router'
import PullRefresh from '@/components/PullRefresh.vue'

const { t } = useI18n();
const list = ref([])
const subject:any = ref({})
const route = useRoute()
const router = useRouter()
let regTime:any = ref('')
let loading = ref(false)
let loading2= ref(false)
let loading3 = ref(false)
const _data = ref({})
const SDK_V:any = SDK_VALUE()
const textareaValue = ref('')
const fileList = ref<any[]>([])

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
   //  getData(_params)
})
const getData = (v:Object) =>{
    requestGet(Api.REPLY_QUESTION,v).then((res:any)=>{
        list.value = res.data.data.list
        subject.value = res.data.data.subject
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
    })
}

const onRefresh = ()=>{
    setTimeout(() => {
        loading3.value = !loading3.value
        loading2.value = false
        getData(_data.value)
    }, 1000);
}

const submitQ = ()=>{
    if(textareaValue.value.length<=0){
        Toast.fail({
            message:t('Description'),
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
                    message: t('TwoImages'),
                    position: 'top'
                });
                return
            }
            else if(videos.length>1){
                Toast({
                    message: t('Video'),
                    position: 'top'
                });
                return
            }
            else if(videos.length!==0 && Math.ceil(videos[0].file.size/1024) > 51200){
                Toast({
                    message: t('Max'),
                    position: 'top'
                });
                return
            }
            else{
                alert("提交2")
            }
        }
        else{
            alert('提交')
        }
    }
}
</script>
<style lang="less" scoped>
.my-head-title {
    padding-left: 10px;
}
</style>