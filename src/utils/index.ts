declare var PnSDK: any
const readSDK = () => {
 let uid = ""
        let guid = ""
        return new Promise((resolve, reject) => {
                try {
                    //获取SDK,JWT PnSDK.toast 打印
                let sdks:any = ''
                let jwt:any = ''
                Promise.all([PnSDK.queryString(),PnSDK.get("jwt","",true)]).then((r)=>{
                    sdks = r[0]
                    jwt = r[1]
                    if(jwt){
                        let jwtData:any = ''
                        Promise.all([PnSDK.parseJwt(jwt)]).then((rs)=>{
                            jwtData = rs[0]
                            uid = jwtData.uid
                            resolve({
                                auth: jwt,
                                url: window.location.search,
                                uid:uid,
                                appid: sdks.appid,
                                language: sdks.l,
                                nickname:exURL('nickname'),
                                srvid:exURL('srvid'),
                                guid:guid,
                                sdks:JSON.stringify(sdks)
                            })
                        }).catch((v) => {
                            reject(v)
                        })
                    }
                    else{
                        uid = sdks.guid
                        guid = sdks.guid
                        resolve({
                            auth: "",
                            url: window.location.search,
                            uid:uid,
                            appid: sdks.appid,
                            language: sdks.l,
                            nickname:exURL('nickname'),
                            srvid:exURL('srvid'),
                            guid:guid,
                            sdks:JSON.stringify(sdks)
                        })
                    }
                }).catch((v) => {
                    reject(v)
                })
                } catch (error) {
                    alert(error)
                    // this.exError("read SDK error","en",true,"SDK")
            }

        })
}

const exURL = (v:any) => {
    let reg = new RegExp('(^|&)' + v + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
}
export default readSDK