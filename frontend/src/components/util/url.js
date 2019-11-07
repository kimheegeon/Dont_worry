// 로컬용
// var local = 'http://127.0.0.1:3000/'
// 릴리스용
var release = 'http://dontworry-env-2.bs63khyer9.ap-northeast-2.elasticbeanstalk.com/'

var _url = release

export default {
  data () {
    return {
      url: _url
    }
  }
}
