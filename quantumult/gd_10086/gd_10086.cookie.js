
// ^https:\/\/gd.10086.cn\/gmccapp\/confactapp\/\?sessionid=.* url script-request-header https://raw.githubusercontent.com/Weicoz/scripts/master/quantumult/gd_10086/gd_10086.cookie.js
const headerName = '广东移动'
const headerKey = 'header_10086'
const bodyKey = 'body_10086'
const sessionidKey = 'sessionid_10086'

const c = init()
const header = $request.headers
const body = $request.body
const sessionid = getQueryString('sessionid')

if (header.Cookie) {
    if (c.setdata(JSON.stringify(header), headerKey) && c.setdata(sessionid, sessionidKey)) {
        c.msg(`${headerName}`, '获取Cookie: 成功', '')
        c.log(`[${headerName}] 获取Cookie: 成功, cookie: ${header.Cookie}`)
    }
}

if (body){
    if (c.setdata(JSON.stringify(body), bodyKey)){
        c.msg(`${headerName}`, '获取body: 成功', '')
        c.log(`[${headerName}] 获取body: 成功, body: ${body}`)
    }
}


function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let s = $request.url.match(new RegExp(/\?.*/))
    if (s != null) {
        s = s[0]
    }
    let r = s.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
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
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
c.done()
