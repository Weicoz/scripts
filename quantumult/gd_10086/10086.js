const chavy = init()
const cookieName = '广东移动'
const KEY_signcookie = 'cookie_10086'

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
    const url = { url: `https://push.it.10086.cn/`, headers: { Cookie: VAL_signcookie} }
    url.headers['Accept'] = `application/json`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    url.headers['Accept-Language'] = `zh-Hans;q=1`
    url.headers['Connection'] = `keep-alive`
    url.headers['Host'] = `push.it.10086.cn`
    url.headers['User-Agent'] = `{"version":"7.0.7","type":"iOS"}`
    chavy.post(url, (error, response, data) => {
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
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, put, done }
}
chavy.done()
