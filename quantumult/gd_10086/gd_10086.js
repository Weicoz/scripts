const c = init()
const headerName = '广东移动'
const headerKey = 'header_10086'
const bodyKey = 'body_10086'
const sessionidKey = 'sessionid_10086'

const signinfo = {}
let header = JSON.parse(c.getdata(headerKey))
let body = c.getdata(bodyKey).replace('reqJson=', '')
let sessionid = c.getdata(sessionidKey)

;(exec = async () => {
    c.log(`🔔 ${headerName} 开始签到`)
    await signapp()
    showmsg()
    c.done()
})().catch((e) => c.log(`❌ ${headerName} 签到失败: ${e}`), c.done())


function signapp() {
    return new Promise((resolve, reject) => {
        let reqJson = JSON.parse(body);
        reqJson['timestamp'] = new Date().getTime();
        let _body = "reqJson=" + encodeURIComponent(JSON.stringify(reqJson))
        const url = {
            url: `https://gd.10086.cn/gmccapp/confactapp/?sessionid=${sessionid}&servicename=GMCCAPP_630_032_001_002`,
            headers: {
                'X-Requested-With' : `XMLHttpRequest`,
                'Connection' : `keep-alive`,
                'Accept-Encoding' : `gzip, deflate, br`,
                'Content-Type' : `application/x-www-form-urlencoded; charset=UTF-8`,
                'Origin' : `https://gd.10086.cn`,
                'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 GDMobile/7.0.7 gmcchh chinamobile_014655A gmcchh/7.0.7 iOSAmberV2.7.1`,
                'Cookie' : header.Cookie,
                'Host' : `gd.10086.cn`,
                'Referer' : `https://gd.10086.cn/gmccapp/confactpage/sigin/index.html?isApp=0&session=${sessionid}`,
                'Accept-Language' : `zh-cn`,
                'Accept' : `text/plain, */*; q=0.01`
            },
            body: _body
        }
        c.post(url, (error, response, data) => {
            try {
                signinfo.signapp = data
                c.log(data)
                resolve()
            } catch (e) {
                c.msg(headerName, `签到结果: 失败`, `说明: ${e}`)
                c.log(`❌ ${headerName} signapp - 签到失败: ${e}`)
                c.log(`❌ ${headerName} signapp - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}


function showmsg() {
    let subTitle = ''
    let detail = ''
    if (isString(signinfo.signapp)){
        signinfo.signapp = JSON.parse(signinfo.signapp)
    }
    if (signinfo.signapp) {
        subTitle = '签到: 成功'
        detail = `说明: ${signinfo.signapp.msg}`
    } else {
        subTitle = '签到: 失败'
        detail = `说明: ${signinfo.signapp.msg}`
    }
    c.msg(headerName, subTitle, detail)
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
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, put, done }
}
c.done()
