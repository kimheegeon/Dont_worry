<template>
  <div id="app">
    <sidemenu/>
    <div class="main" v-if="WaterQ == 1">
     <p class="title">아주 좋음</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/smiley.png">
    </div>
    <div class="main" v-else-if="WaterQ == 2">
     <p class="title">보통</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/neutral.png">
    </div>
    <div class="main" v-else-if="WaterQ == 3">
     <p class="title">나쁨</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/sadsmiley.png">
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

export default {
  name: 'App',
  data(){
    return {
      WaterQ: 3,
      location:"제주시 한림읍 225",
      lat:'',
      lng:'',
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
      'setWaterQ'
    ]),
    checkWaterQ: function() {
      var self = this
      //수질 확인 api 호출
      axios.post('/', {
        LONGITUDE: this.lng,
        LATITUDE: this.lat,
      })
      .then(response => {
        //호출 성공시
        if(response.data.STATUS_CODE == '00'){
          //수질데이터 값 로컬 저장 및 화면변경
          // this.WaterQ = response.data.WaterQ
          // this.$store.commit('auth/setWaterQ',this.WaterQ)
        } else {
          this.modalErrTitle = '수질데이터 확인 실패'
          this.modalErrMessage = '수질데이터 확인에 실패했습니다.'
          this.showModalError = true
        }
      })
      .catch(error => {
        //에러 발생시
        console.log(error)
        this.modalErrTitle = '전송실패'
        this.modalErrMessage = '예기치 못한 에러가 발생했습니다.'
        this.showModalError = true
      })
    },
    geolocate: function() {
      var self = this
      navigator.geolocation.getCurrentPosition(position => {
        self.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('location',self.center)
        // if(load_map)
        // {
        //   self.checkWaterQ()
        // }
      },
      error => {
        if(self.position_error_flg == false)
        {
          var err_msg = "";
          switch(error.code)
          {
            case 1:
              err_msg = "위치정보 이용을 허용해주세요.";
              break;
            case 2:
              err_msg = "디바이스 위치가 부정확합니다.";
              break;
            case 3:
              err_msg = "단말기의 통신상태를 확인하세요.(타임아웃)";
              break;
          }
          self.modalErrTitle = '위치정보 획득 실패'
          self.modalErrMessage = err_msg
          self.showModalError = true
          self.position_error_flg = true
        }
        // if(load_map)
        // {
        //   self.checkWaterQ()
        // }
      }
      );
    },
  },
  created() {
    // this.checkWaterQ()
    this.geolocate()
    this.setWaterQ(this.WaterQ)
    console.log('WaterQ',this.WaterQ)
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/top.scss";
</style>
