<template>
  <div id="app">
    <sidemenu/>
    <div class="main" v-if="WaterQ == 1">
     <p class="title">아주 좋음</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/laughing.png">
    </div>
    <div class="main" v-else-if="WaterQ == 2">
     <p class="title">보통</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/smiling.png">
    </div>
    <div class="main" v-else-if="WaterQ == 3">
     <p class="title">나쁨</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/sad.png">
    </div>
     <p class="set_location"><u v-on:click="geolocate()">내 주변 지하수 위치 재설정</u></p>

     <!-- 에러 모달 -->
     <ErrorModal v-if="showModalError" @close="showModalError = false" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
  </div>
</template>

<script>
import Nav from '../../src/components/Layout/Nav'
import BaseModal from './Modal/BaseModal'
import { mapMutations,mapGetters } from 'vuex'
import axios from 'axios'
import url from './util/url'
import socket from 'socket.io'
import * as io from 'socket.io-client'

export default {
  name: 'Main',
  mixins: [url],
  data(){
    return {
      WaterQ: '',
      location:'',
      lat:'126.5337625',
      lng:'33.5158542',
      showModalError: false,
      modalErrTitle: '',
      modalErrMessage: '',
      position_error_flg:false
    }
  },
  components: {
    'sidemenu':Nav,
    'ErrorModal': BaseModal
  },
  methods: {
    ...mapMutations('auth', [
      'setWaterQ',
      'setLocation'
    ]),
    checkWaterQ: function() {
      var self = this
      //수질 확인 api 호출
      axios.get(this.url + 'water/checkWaterQ', {
        params:{
          LONGITUDE: this.lng,
          LATITUDE: this.lat
        }
      })
      .then(response => {
        var res = JSON.parse(response.data)
        console.log(res)
        //호출 성공시
        if(res.STATUS_CODE == '00'){
          //수질데이터 값 로컬 저장 및 화면변경
          this.WaterQ = res.WaterQ
          this.location = res.location
          this.$store.commit('auth/setWaterQ',this.WaterQ)
          this.setLocation(this.location)
        } else {
          this.modalErrTitle = '수질데이터 확인 실패'
          this.modalErrMessage = '수질데이터 확인에 실패했습니다.'
          this.showModalError = true
        }
      })
      .catch(error => {
        //에러 발생시
        console.log("에러",error)
        this.modalErrTitle = '전송실패'
        this.modalErrMessage = '예기치 못한 에러가 발생했습니다.'
        this.showModalError = true
      })
    },
    geolocate: function() {
      var self = this
      
      // if(navigator.platform == 'Win16' || navigator.platform == 'Win32' || navigator.platform == 'Win64' 
      //     || navigator.platform == 'MacIntel' || navigator.platform == 'Mac'){ 
      //   console.log("navigator.platform : ", navigator.platform);
      //   alert("pc입니다")
      // }else{
      //   alert("모바일입니다")
      //}
     
      // navigator.geolocation.getCurrentPosition(position => {
      //   self.center = {
      //     lat: position.coords.latitude,
      //     lng: position.coords.longitude
      //   };
      //   console.log('location',self.center.lat)

      //   self.lat = 126.5337625
      //   self.lng = 33.5158542
      //   self.checkWaterQ()
      // },
      // error => {
      //   if(self.position_error_flg == false)
      //   {
      //     var err_msg = "";
      //     switch(error.code)
      //     {
      //       case 1:
      //         err_msg = "위치정보 이용을 허용해주세요.";
      //         break;
      //       case 2:
      //         err_msg = "디바이스 위치가 부정확합니다.";
      //         break;
      //       case 3:
      //         err_msg = "단말기의 통신상태를 확인하세요.(타임아웃)";
      //         break;
      //     }
      //     self.modalErrTitle = '위치정보 획득 실패'
      //     self.modalErrMessage = err_msg
      //     self.showModalError = true
      //     self.position_error_flg = true
      //   }
      // },
      // {timeout: 10000, maximumAge:Infinity,}
      // );

      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        console.log(lastPosition);
      });
    },
    CallSocket:function(){
      console.log('socket')
      var socket = io.connect(this.url)
      var self = this
      socket.on('alert', function (data) {
        var res = JSON.parse(data)
        self.WaterQ = res
        self.$store.commit('auth/setWaterQ',self.WaterQ)
        console.log('SocketRes',res)
      })
    }
  },
  created() {
    //this.geolocate()
    this.checkWaterQ()
    this.setWaterQ(this.WaterQ)
    console.log('WaterQ',this.WaterQ)
  },
  watch: {
    WaterQ: function(val, oldVal) {
      if(val !== oldVal){
        this.checkWaterQ()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/top.scss";
</style>
