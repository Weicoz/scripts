// https:\/\/api.sfacg.com\/user\/tickets url script-request-header sfacg/sfacg.cookie.js

const cookieName = 'SFACG菠萝包'
const cookieKey = 'cookie_sfacg'
const SFSecurityKey = 'SFSecurity_sfacg'
const AuthorizationKey = 'Authorization_sfacg'

const chavy = init()
const cookieVal = $request.headers['Cookie']
const SFSecurityVal = $request.headers['SFSecurity']
const AuthorizationVal = $request.headers['Authorization']

if (cookieVal) {
  if (chavy.setdata(cookieVal, cookieKey) && chavy.setdata(SFSecurityVal, SFSecurityKey) && chavy.setdata(AuthorizationVal, AuthorizationKey)) {
    chavy.msg(`${cookieName}`, '获取Cookie & SFSecurity && Authorization: 成功', '')
    chavy.log(`[${cookieName}] 获取Cookie: 成功, cookie: ${cookieVal} | SFSecurity: ${SFSecurityVal} | Authorization: ${AuthorizationVal}`)
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
