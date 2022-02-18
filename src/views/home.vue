<template>
<van-nav-bar :title="t('Home.HeadIndex').replace('$uid', '\n' + uid + '\n')" class="my-head-title" safe-area-inset-top>
    <template #left>
        <div class="br-radius"><van-icon name="manager" class="home-my-title-icon" color="#e5d1b8" /></div>
    </template>
</van-nav-bar>
<div class="pdb4">
    <div class="home-my-serverbtn">
        <van-button type="default" @click="serviceRecord">
            <van-image
            width="1.4rem"
            height="1.4rem"
            position="left"
            fit="contain"
            src="../src/assets/ad.png"
            />
            <div class="ml5">{{t('Home.ServiceRecord')}}</div>
            <div class="servericon"><van-icon name="arrow"/></div>
        </van-button>
    </div>
    <div class="home-my-server">
<van-collapse v-model="activeName" accordion>
  <van-collapse-item v-for="(v,k) in list" :key="k" :title="v['name']" :name="k">
      <van-collapse v-model="activeName2" accordion>
          <van-collapse-item v-for="(o,i) in v['questions']" :key="i" :title="o['q']" :name="i">
              <span>{{o['a']}}</span>
          </van-collapse-item>
         <div><van-icon name="service" size="1.5rem" color="#2196f3"/>{{t('Home.ContactWorkerCustomerService')}}</div>
      </van-collapse>
  </van-collapse-item>
</van-collapse>
    </div>
</div>
</template>
<script lang="ts" setup>
import { defineComponent,ref,onMounted,getCurrentInstance } from 'vue'

import { useI18n } from "vue-i18n";
import {SDK_VALUE,requestGet}  from '../utils/request'
import {Api} from '../config/api'
import {useRouter } from 'vue-router'
import {Toast}  from 'vant'
const loading = ref(true)
const { t } = useI18n();
const uid = ref('')
const activeName = ref('1')
const activeName2 = ref('2')
const list = ref([])
const router = useRouter()
const SDK_V:any = SDK_VALUE()


SDK_V.then((v:any)=>{
    const _data = {
        appid:(v.appid).toString().substr(0,4),
        language:v.language,
    }
    const _url = Api.HOME_FAQ_LIST+'/'+_data.appid+'/'+_data.language
    requestGet(_url).then((res:any)=>{
            list.value = res.data.data.list
            uid.value = typeof v.uid === 'number'?v.uid:''
            Toast.clear()
    })
})
        //     const _url = Api.HOME_FAQ_LIST+'/'+2000+'/'+'cn'

        //  requestGet(_url).then((res:any)=>{
        //         list.value = res.data.data.list
        //         uid.value = 2000
        //         Toast.clear()
        // })


const serviceRecord = () => {
    router.push({name:'MyQuestion'})
}

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
.home-my-serverbtn{
    position: relative;
}

.home-my-server{
    position: relative;
    margin-top: 20px;
}

.servericon{
    position: absolute;
    right: 0;
    top: 5px;
}
</style>