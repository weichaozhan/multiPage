function getURLParams() {
  if (location.search.slice(1)) {
    var paramsList = location.search.slice(1).split('&')
    var param = {}

    for (var i = 0; i < paramsList.length; i++) {
      var keyValue = paramsList[i].split('=')

      param[keyValue[0]] = keyValue[1]
    }

    return param
  } else {
    return {}
  }
}

var pageType = getURLParams().typeCode
var param = getURLParams()
var paramStr = ''

if (Object.keys(param).length > 0) {
  for (var item in param) {
    paramStr += (item + '=' + param[item] + '&')
  }
}

if (paramStr) {
  paramStr = '?' + paramStr.slice(0, -1)
}

const map = {
  1: 'page1.html',
}

// if (pageType && map[pageType] && location.pathname.split('/').slice(-1)[0] !== map[pageType]) {
if (pageType && map[pageType]) {
  location.href = map[pageType] + paramStr
}