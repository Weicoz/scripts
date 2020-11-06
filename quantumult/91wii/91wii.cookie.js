// https:\/\/www.91wii.com\/plugin.php\?id=dc_signin:sign&inajax=1 url script-request-header https://raw.githubusercontent.com/Weicoz/scripts/master/quantumult/91wii/91wii.cookie.js
// 2 1,12 * * * https://raw.githubusercontent.com/Weicoz/scripts/master/quantumult/91wii/91wii.js, tag=91wii签到, enabled=true
const cookieName = '91wii'
const chavy = init()
const param = ['Cookie'];
const data = {};
var data_json = '';
for (var item in param){
    if ($request.headers[param[item]]){
        data[param[item]] = $request.headers[param[item]]
    }
}
var data_json = JSON.stringify(data);
if (data_json) {
    if (chavy.setdata(data_json, cookieName + '_header')) {
        chavy.msg(`${cookieName}`, '获取Cookie成功', '')
        chavy.log(`[${cookieName}] 获取Cookie: 成功 ${data_json}`)
    }
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
chavy.done()
