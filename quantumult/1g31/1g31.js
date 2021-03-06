const chavy = init()
const cookieName = '1g31论坛'
const url = 'http://www.1g31.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes' 
const host = 'www.1g31.com' 
const signinfo = {}

var header_json = chavy.getdata(cookieName + '_header')
var body_json = chavy.getdata(cookieName + '_body')
if (!header_json){
    chavy.log(`🔔 ${cookieName} 请获取Cookie后执行`)
    chavy.done()
}
var header_data = JSON.parse(header_json);
var body_data = JSON.parse(body_json);
;(exec = async () => {
    chavy.log(`🔔 ${cookieName} 开始签到`)
    await signapp()
    showmsg()
    chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())



function signapp() {
    return new Promise((resolve, reject) => {
        const request = {
            url: url,
            headers: header_data,
            body: {
                formhash: body_data['formhash'],
                qdxq: 'shuai',
                qdmode: 1,
                todaysay: '我来签到啦！！！',
                fastreply: 0
            }
        }
        request.headers['Content-Type'] = `application/x-www-form-urlencoded`
        request.headers['Host'] = host
        request.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
        request.headers['Accept'] = `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`
        //
        request.headers['Accept-Encoding'] = `gzip, deflate`
        request.headers['Accept-Language'] = `zh-CN,zh;q=0.9,ja;q=0.8,zh-TW;q=0.7`
        request.headers['Connection'] = `keep-alive`
        chavy.post(request, (error, response, data) => {
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
    let subTitle = '成功'
    let detail = ''
    // if (signinfo.signapp) {
    //     signinfo.signapp = JSON.parse(signinfo.signapp)
    // }
    // if (signinfo.signapp) {
    //     subTitle = '签到: 成功'
    //     if (signinfo.signapp.status.msg){
    //         detail = `说明: ${signinfo.signapp.status.msg}`
    //     }else{
    //         detail = `说明: 获得火券数 ${signinfo.signapp.data.coupons}`
    //     }
    // } else {
    //     subTitle = '签到: 失败'
    //     detail = `说明: ${signinfo.signapp}`
    // }
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
