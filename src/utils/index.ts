import { rejects } from "assert"
import { time } from "console"
import { Toast } from "vant"

declare var PnSDK: any
export function readSDK() {
    let uid = ""
    let guid = ""              
    //获取SDK,JWT PnSDK.toast 打印
    let sdks:any = ''
    let jwt: any = ''
    Toast.loading({
        overlay:true,
        forbidClick: true,
        message:'SDK \n Loading...',
        duration:0
    });
    let p1 = new Promise((res, rej) => { 
        PnSDK.queryString().then((v: any) => {
            res(v)
        }).catch((e: any) => { 
            rej(e)
        })
    })
    let p2 = new Promise((res, rej) => { 
        PnSDK.get("jwt","",true).then((v: any) => {
            res(v)
        }).catch((e: any) => { 
            rej(e)
        })
    })
    return new Promise(async (resolve, reject) => {
        const r = await Promise.all([p1, p2])
        sdks = r[0]
        jwt = r[1]
        if (jwt) {
            let jwtData: any = ''
       return  Promise.all([PnSDK.parseJwt(jwt)]).then((rs) => {
                jwtData = rs[0]
                uid = jwtData.uid
                resolve({
                    auth: jwt,
                    url: window.location.search,
                    uid: uid,
                    appid: sdks.appid,
                    language: sdks.l,
                    nickname: exURL('nickname'),
                    srvid: exURL('srvid'),
                    guid: guid,
                    sdks: JSON.stringify(sdks)
                })
            }).catch((v_1) => {
                reject(v_1)
            })
        }
        else {
            uid = sdks.guid
            guid = sdks.guid
            resolve({
                auth: "",
                url: window.location.search,
                uid: uid,
                appid: sdks.appid,
                language: sdks.l,
                nickname: exURL('nickname'),
                srvid: exURL('srvid'),
                guid: guid,
                sdks: JSON.stringify(sdks)
            })
        }
                
        Toast.clear()
    })
}
    

export function exURL(v:any){
    let reg = new RegExp('(^|&)' + v + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
}
export default readSDK
