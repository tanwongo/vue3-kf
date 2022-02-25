<template>
<div :style="'background:url('+bgUrl+')'">
    <van-nav-bar class="my-head-title" safe-area-inset-top>
      <template #left>
          <div class="br-radius" style="color:#fff">{{headTitle}}</div>
      </template>
    </van-nav-bar>
    <div class="pdb4 operationQuestionaire">
        <div class="cont">
            <div v-for="(v,k) in list" :key="k" class="mt10">
                <div :key="k" v-if="v['type'] === 'input' &&(!branchesArray.includes(v['name']) || branchesName[v['name']])">
                    <div>
                        <div class="submit-question-flex">
                            <van-cell-group inset>
                                <van-field
                                    v-model="formInput[v['name']]"
                                    rows="2"
                                    autosize
                                    :required="v['isrequired']"
                                    :label="v['title']"
                                    type="textarea"
                                    :maxlength="v['max']"
                                    :minlength="v['min']"
                                    placeholder=""
                                    show-word-limit
                                />
                            </van-cell-group>
                        </div>
                    </div>
                </div>
                <div :key="k" v-if="v['type'] === 'checkbox'&&(!branchesArray.includes(v['name']) || branchesName[v['name']])">
                    <div>
                        <van-cell-group inset>
                            <div class="p16 brm"><span class="isrequired">{{v['isrequired']?'*':''}}</span>{{v['title']}}</div>
                            <div class="p16">
                                <van-checkbox-group v-model="formChecked[v['name']]">
                                    <van-checkbox v-for="(ck,i) in v['items']"  :key="i" :name="ck" shape="square" :max="v['max']" icon-size="14px">{{ck}}</van-checkbox>
                                </van-checkbox-group>
                            </div>
                        </van-cell-group>
                    </div>
                </div>
                <div :key="k" v-if="v['type'] === 'radio' &&(!branchesArray.includes(v['name']) || branchesName[v['name']])">
                    <div>
                        <van-cell-group inset>
                            <div class="p16 brm"><span class="isrequired">{{v['isrequired']?'*':''}}</span>{{v['title']}}</div>
                            <div class="p16">
                                <van-radio-group v-model="formRadio[v['name']]"  @change="branchRadio">
                                    <van-radio v-for="(ck,i) in v['items']" :key="i" :name="i+','+v['name']"  icon-size="14px">{{ck}}</van-radio>
                                </van-radio-group>
                            </div>
                        </van-cell-group>
                    </div>
                </div>
                <div :key="k" v-if="v['type'] === 'matrix'&&(!branchesArray.includes(v['name']) || branchesName[v['name']])">
                    <div>
                        <div class="matrix-radio">
                            <van-cell-group inset>
                                <div class="p16 brm"><span class="isrequired">{{v['isrequired']?'*':''}}</span>{{v['title']}}</div>
                                <div class="p16">
                                    <van-radio-group v-model="formMatrix[v['name']]">
                                        <van-radio v-for="(ck,i) in Array(...Array(v['number'])).map((n,m)=>m+1)" :key="i" :name="ck"  icon-size="14px">{{ck}}</van-radio>
                                    </van-radio-group>
                                </div>
                            </van-cell-group>
                        </div>
                    </div>
                </div>
                <div :key="k" v-if="v['type'] === 'score'&&(!branchesArray.includes(v['name']) || branchesName[v['name']])">
                    <div>
                            <van-cell-group inset>
                                <div class="p16 brm"><span class="isrequired">{{v['isrequired']?'*':''}}</span>{{v['title']}}</div>
                                <div class="p16">
                                    <van-rate
                                    v-model="formScore[v['name']]"
                                    :size="20"
                                    color="#ffd21e"
                                    void-icon="star"
                                    void-color="#eee"
                                    />
                                </div>
                            </van-cell-group>
                        </div>
                </div>
            </div>
        </div>
        <div class="radius-3-vant-btn mg16">
            <van-button block type="primary" class="mt10" @click="submitOperationQ">{{t('SubmitQuestion.Submit')}}</van-button>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import { Toast } from 'vant'
import { reactive, ref, onMounted, toRefs } from 'vue'
import { useI18n } from "vue-i18n";
import {requestGet}  from '../utils/request'

const { t } = useI18n();
const headTitle = ref('')
const bgUrl = ref('')
let list:any =  ref<any[]>([])
let formInput = ref([])
let formChecked = ref({})
let formBranches:any = ref({})
let formRadio = reactive({})
let formMatrix = reactive([])
let formScore = reactive([])
let hasBranches:any = ref({})
let branchesArray:any = ref([])
let branchesName:any = ref({})

let refName = ref('')
onMounted(()=>{
    getQnr()
})
const getQnr = ()=>{
    let localHostsc = 'http://172.26.134.86:8001'
    let _appId = 2000
    let _lang = 'cn'
    let _platform = 'All'
    let _user = 123
    let _url  = `${localHostsc}/qnr/${_appId}/${_lang}/${_platform}/${_user}`
    requestGet(_url).then((res:any)=>{
        console.log(res)
        headTitle.value = res.data.data.form.title
        list.value = res.data.data.form.data.data
        formBranches.value = res.data.data.form.data.branches
        let arr:any = []
        Object.keys(formBranches.value).map((v:any)=>{
             for(const d of formBranches.value[v]){
                arr.push(d)
             }
        })
       branchesArray.value = arr
        // for(const k in formBranches.value){
        //     arr.push(...formBranches.value[k])
        // }
        // branchesArray[k].value = arr
        console.log(branchesName.value)
        if(res.data.data.form.bgimg_url){
            bgUrl.value = res.data.data.form.bgimg_url
        }
        Toast({
            message: '欢迎藏家20002年大飞机的沪GRE胡带我去和的问卷调查，读后感服务呵呵哒请勿一定会我去',
            forbidClick: true,
            icon:'smile',
            duration:2000,
            className:"operation-toast"
            
        });
    })
}

//点击radio 显示分支
const branchRadio = (v:any) => {
    let re = v.split(',')
    let _clickIndex = re[0] //当前点击的Index
    let _showName = re[1] //当前radio的name
    for(const d of formBranches.value[_showName]){
        if(d === formBranches.value[_showName][_clickIndex] && formBranches.value[_showName][_clickIndex]!==""){
            branchesName.value[d] = true
        }
        else{
            if(formBranches.value[d]){
                for(const q of formBranches.value[d]){
                    branchesName.value[q] = false
                    // delete formRadio.[d]
                }
            }
            console.log(formRadio)
            branchesName.value[d] = false
        }
    }
}

const submitOperationQ = ()=>{
    let arr:any  = []

      let a:any = [formInput.value,formChecked.value,formRadio.value,formMatrix.value,formScore.value]
    
    for(const d of a){
        for(const k in d){
            arr.push({
                name:k,
                value:d[k]
            })
        }

    }
    
    console.log(arr)
}
</script>
<style lang="less" scoped>
.mg16{
    margin: 0 16px;
}
.brm{
    border-bottom: 1px solid #f0f0f0;
}
.p16{
    padding: 10px 16px;
    font-size: 14px;
}
.isrequired{
    font-size: 12px;
    color: #f10a24;
}
.show{
    display: block;
}
.hide{
    display: none;
}
</style>