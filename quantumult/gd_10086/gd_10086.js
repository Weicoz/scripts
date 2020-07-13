const c = init()
const headerName = '广东移动'
const urlKey = 'url_10086'
const headerKey = 'header_10086'
const bodyKey = 'body_10086'

const signinfo = {}
let url = c.getdata(urlKey)
let header = c.getdata(headerKey)
let body = c.getdata(bodyKey).replace('reqJson=', '')

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
            url: url,
            headers: JSON.parse(header),
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
        detail = `说明: ${signinfo.signapp.status.msg}`
    } else {
        subTitle = '签到: 失败'
        detail = `说明: ${signinfo.signapp}`
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
