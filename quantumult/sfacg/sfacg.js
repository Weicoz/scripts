const chavy = init()
const cookieName = 'SFACG菠萝包'
const KEY_signcookie = 'cookie_sfacg'
const KEY_SFSecurity = 'SFSecurity_sfacg'
const KEY_Authorization = 'Authorization_sfacg'

const signinfo = {}
let VAL_signcookie = chavy.getdata(KEY_signcookie)
let VAL_SFSecurity = chavy.getdata(KEY_SFSecurity)
let VAL_Authorization = chavy.getdata(KEY_Authorization)

;(exec = async () => {
    chavy.log(`🔔 ${cookieName} 开始签到`)
    await signapp()
    showmsg()
    chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())


function signapp() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://api.sfacg.com/user/signInfo`,
            headers: {Cookie: VAL_signcookie, SFSecurity: VAL_SFSecurity, Authorization: VAL_Authorization}
        }
        url.headers['Accept'] = `application/vnd.sfacg.api+json;version=1`
        url.headers['Accept-Encoding'] = `gzip, deflate, br`
        url.headers['Accept-Language'] = `zh-Hans-CN;q=1`
        url.headers['Connection'] = `keep-alive`
        url.headers['Host'] = `api.sfacg.com`
        url.headers['User-Agent'] = 'boluobao/4.5.44(iOS;13.5.1)/appStore'
        chavy.put(url, (error, response, data) => {
            try {
                signinfo.signapp = data
                chavy.log(data)
                resolve()
            } catch (e) {
                chavy.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
                chavy.log(`❌ ${cookieName} signapp - 签到失败: ${e}`)
                chavy.log(`❌ ${cookieName} signapp - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}


function showmsg() {
    let subTitle = ''
    let detail = ''
    if (signinfo.signapp) {
        signinfo.signapp = JSON.parse(signinfo.signapp)
    }
    if (signinfo.signapp) {
        subTitle = '签到: 成功'
        if (signinfo.signapp.status.msg){
            detail = `说明: ${signinfo.signapp.status.msg}`
        }else{
            detail = `说明: 获得火券数 ${signinfo.signapp.data.coupons}`
        }
    } else {
        subTitle = '签到: 失败'
        detail = `说明: ${signinfo.signapp}`
    }
    chavy.msg(cookieName, subTitle, detail)
}

function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    put = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'PUT'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return {isSurge, isQuanX, msg, log, getdata, setdata, get, post, put, done}
}

chavy.done()
