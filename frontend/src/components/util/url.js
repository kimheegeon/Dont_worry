// 로컬용
 var local = 'http://192.168.0.90:3000/'
// 릴리스용
// var release = 'http://dontworry-env-2.bs63khyer9.ap-northeast-2.elasticbeanstalk.com/'

var _url = local

export default {
  data () {
    return {
      url: _url
    }
  }
}
