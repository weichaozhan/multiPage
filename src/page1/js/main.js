import '../../public/style/reset.less'
import '../../public/style/scaffold.less'
import '../../public/style/windowAlert.less'

import {
  request
} from '../../public/js/public/public'
import showToast from '../../public/js/public/showToast'

$(document).ready(function () {
  setTimeout(() => {
    request('/api/test', 'post', {
      userid: 'dasfdsfa111sdgfag12fd24g24s'
    }, (res) => {
      showToast(JSON.stringify(res.data))
    })
  }, 2000);
})