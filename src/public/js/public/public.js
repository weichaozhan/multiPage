import showToast from './showToast.js'

// jQuery ajax 封装
export const request = (url, type, data, successFunc, completeFunc) => {
  // const dataResolve = type !== 'get' ? JSON.stringify(data) : data
  const host = ''
  const urlStr = host + url

  $.ajax(urlStr, {
    type: type,
    // contentType: 'application/json;charset=UTF-8',
    data: data,
    // dataType: 'json',
    success: successFunc,
    complete: completeFunc,
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      confirmFunc(textStatus || errorThrown)
    }
  })
}

// 生成 uuid 
export function createUUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

// 获取移动端浏览器内核
export const browser = {
  versions: function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {         //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

// 弹窗开启关闭

// 记录打开窗口时的滚动高度
var docScrollPosition = 0
// 打开的窗口数量
var windowAlertCount = 0
export const windowAlertArgs = {
  /**
   * @description 弹窗开启
   * @param {Function} callback 回调函数
   */
  openFunc: (callback) => {
    // 每打开一次窗口计数 +1
    windowAlertCount ++

    docScrollPosition = document.scrollingElement.scrollTop

    $('body').addClass('modal-open')
    document.body.style.top = -docScrollPosition + 'px';
    
    callback && callback()
  },
  /**
   * @description 弹窗关闭
   * @param {Function} callback 回调函数
   */
  closeFunc: (callback) => {
    // 每关闭一次窗口计数 +1
    windowAlertCount--
    
    // 计数为 0 时
    if (windowAlertCount === 0) {
      $('body').removeClass('modal-open')
      document.scrollingElement.scrollTop = docScrollPosition
    }

    callback && callback()
  }
}

// confirm 
export const confirmFunc = (text, sureFunc, cancelFunc) => {
  const id = createUUID()

  function closeConfirm(id) {
    $(`#window-alert-confirm-${id}`).remove()
    windowAlertArgs.closeFunc()
  }

  windowAlertArgs.openFunc(() => {
    $('body').append(`
    <div id="window-alert-confirm-${id}" class="window-alert">
      <div class="component-confirm pos-center">
        <div class="component-confirm__content">${text}</div>
        <div class="component-confirm__footer">
          <button id="btn-cancel--confirm-${id}" class="btn-cancel" data-id="${id}">取消</button>
          <button id="btn-sure--confirm-${id}" class="btn-sure" data-id="${id}">确定</button>
        </div>
      </div>
    </div>
    `)
  })

  $(`#btn-cancel--confirm-${id}`).on('click', (e) => {
    const id = e.currentTarget.dataset.id
    
    closeConfirm(id)
    cancelFunc && cancelFunc()
  })

  $(`#btn-sure--confirm-${id}`).on('click', (e) => {
    const id = e.currentTarget.dataset.id

    closeConfirm(id)
    sureFunc && sureFunc()
  })
}

/** 
 * 获取 url 参数
*/
export const getURLParams = () => {
  var paramStr = location.search.slice(1)

  if (paramStr.length > 0) {
    var paramsList = paramStr.replace('?', '&').split('&')
    var param = {}
  
    for (var i = 0; i < paramsList.length; i ++) {
      var keyValue = paramsList[i].split('=')
  
      param[keyValue[0]] = keyValue[1]
    }

    return param
  } else {
    return {}
  }
}

/** 
 * 判断设备版本 1.0， 1.1 以后版本，浏览器打开
*/
export const judgeDevice = () => {
  var param = getURLParams()
  var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

  if (browser.versions.mobile) {//判断是否是移动设备打开

    if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo" || ua.match(/QQ/i) == "qq") {
      return 'web'
    } else {
      return 'app'
    }
  } else {
    return 'web'
  }
}

// h5 跳转应用商店
export const jumpToAPPStore = (text) => {
  var urls = {
    'android': 'https://www.baidu.com',
    'ios': 'https://itunes.apple.com'
  }
  
  if (browser.versions.android) {
    // window.location.href = urls.android
    // window.open(urls.android)
    showToast(text)
  } else if (browser.versions.ios) {
    confirmFunc(text, () => {
      window.location.href = urls.ios
    })
  } else {
    showToast(text)
  }
}
