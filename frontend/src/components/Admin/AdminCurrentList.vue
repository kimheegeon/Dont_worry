<template>
    <div id="CurrentList">
        <div class="search_info">
            <form class="form-user">
                <div class="form-group">
                    <input type="text" v-model="keyword" placeholder="정수장 위치" value="">
                </div>
                <div class="form-group">
                  <datepicker v-model="start_date" :format="setDateFormat" name="start_date" placeholder="시작일" id="start_date"></datepicker>
                </div>
                <div class="form-group date-middle">
                  ~
                </div>
                <div class="form-group">
                  <datepicker v-model="end_date" :format="setDateFormat" name="end_date" placeholder="종료일" id="end_date"></datepicker>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-default btn-sm btn-login btn-info" @click="execSearch()">검색</button>
                </div>
            </form>
        </div>
        <br style="clear:both;" />
        <div class="wrapper">
            <table class="Currentlist">
                <tr>
                <th v-for="(value, key) in columns" :key="key">
                    {{ value }}
                </th>
                </tr>
                <tr v-for="(data, index) in WaterQList" :key="index">
                <td v-for="(value, key) in columns" :key="key">
                    <p v-if="key=='AREA'" @click="ShowWaterQ(data['AREA'],data['time'])">{{ data[key] }}</p>
                    <p v-if="key=='WATERQ'" @click="ShowWaterQ(data['AREA'],data['time'])">{{ data[key] }}</p>
                    <p v-if="key=='time'" @click="ShowWaterQ(data['AREA'],data['time'])">{{ data[key] | moment("YYYY-MM-DD HH:mm:ss") }}</p>
                    <!-- <p v-if="key=='WEATHER'" @click="ShowWaterQ(data['AREA'],data['time'])">{{ data[key] }}</p> -->
                </td>
                </tr>
            </table>
            <vue-loading type="spiningDubbles" v-if="loadingFlag" color="#3cb4d3" :size="{ width: '50px', height: '50px' }"></vue-loading>
        </div>
        <AdminDetailModal v-if="showModalDetail" @close="closeDetailModal(false)" @complete="closeDetailModal(true)" :current_no="current_no" :address="address" :search_date="search_date"></AdminDetailModal>
        <ErrorModal v-if="showModalError" @close="showModalError=false" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
    </div>
</template>

<script>
import AdminBaseModal from '../Modal/AdminBaseModal'
import AdminDetailModal from '../Modal/AdminDetailModal'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import 'moment/locale/ko'
import axios from 'axios'
import socket from 'socket.io'
import * as io from 'socket.io-client'
import url from '../util/url'

var DATE_FORMAT = "LL"

export default {
  name: 'CurrentList',
  mixins: [url],
  data() {
    return {
      columns: {
        AREA: '지역',
        WATERQ: '수질 데이터',
        time: '날짜',
        // WEATHER:'날씨(강우량)'
      },
      keyword: "",
      start_date:"",
      end_date:"",
      WaterQList:[],
      offset: 0,
      limit: 10,
      totalPage: 0,
      loadingFlag: false,
      pageNum: 1,
      showModalError: false,
      modalErrTitle: '',
      modalErrMessage: '',
      current_no:'',
      address:'',
      search_data:'',
      showModalDetail: false,
      Waterdata:[],
      ErrLocation:'',
      ErrTime:'',
      ErrTurbidity:''
    }
  },
  components: {
     'AdminDetailModal': AdminDetailModal,
     'ErrorModal': AdminBaseModal,
     'datepicker': Datepicker
  },
  created: function() {
    this.getWaterQList()
    console.log('url',this.url)
  },
  mounted() {
    var area = document.getElementById('start_date')
    area.classList.add('form-control')
    area.setAttribute("style", "background-color: #FFFFFF; height: 40px;")
    var area2 = document.getElementById('end_date')
    area2.classList.add('form-control')
    area2.setAttribute("style", "background-color: #FFFFFF; height: 40px;")
  },
  methods: {
    getWaterQList: function() {
      this.loadingFlag = true
      if(this.start_date !== "" ){
        this.start_date = moment(this.start_date).format("YYYY-MM-DD 00:00:00")
      }
      if(this.end_date !== ""){
        this.end_date = moment(this.end_date).format("YYYY-MM-DD 23:59:59")
      }
      axios.get(this.url + 'water/WaterQList', {
        params:{
          FREE_WORD: this.keyword,
          START_DATE: this.start_date,
          END_DATE:this.end_date
        },
      }
      ).then(response => {
        var res = JSON.parse(response.data)
        console.log(res)
        //로딩표시 제거
        this.loadingFlag = false
        if(res.STATUS_CODE == '00'){
          if(Object.keys(res.WaterQList).length > 0){
            this.WaterQList = res.WaterQList
            console.log(this.WaterQList)
          } else {
            this.WaterQList = []
            this.totalPage = 0
          }
        } else {
          this.modalErrTitle = '수질데이터 획득 실패'
          this.modalErrMessage = '수질데이터 획득에 실패했습니다.'
          this.showModalError = true
        }
        this.CallSocket()
      })
    },
    execSearch: function() {
      // 데이터 클린
      this.offset = 0
      this.pageNum = 1
      this.WaterQList = []
      // 검색
      this.getWaterQList()
    },
    updateResource: function(pageNum) {
      this.offset = (pageNum - 1) * 10
      this.pageNum = pageNum
      this.getWaterQList()
    },
    setDateFormat(date) {
      return moment(date).format(DATE_FORMAT);
    },
    ShowWaterQ(address, date) {
      this.address = address
      this.search_date = date
      this.showModalDetail = true
    },
    closeDetailModal: function(coumplete){
      this.showModalDetail = false
    },
    ShowAlert: function(flag) {
      if(flag == true){
        this.showModalError = true
        this.modalErrTitle = '수질데이터 변화감지 알람'
        this.modalErrMessage = '수질데이터에 급격한 변화가 감지되었습니다.\n 아래의 내용을 확인하십시오.\n'+ '위치:' + this.ErrLocation + '\n날짜:' + this.ErrTime + '\n수질데이터(탁도):' + this.ErrTurbidity
      } else {
        this.showModalError = false
        this.modalErrTitle = ''
        this.modalErrMessage = ''
      }
    },
    CallSocket:function(){
      console.log('socket')
      var socket = io.connect(this.url)
      var self = this
      socket.on('alert', function (data) {
        var res = JSON.parse(data)
        self.Waterdata = res
        console.log('res',res)
        self.ErrLocation = res["Location"]
        self.ErrTime = res["time"]
        self.ErrTurbidity = res["turbidity"]
        if(self.Waterdata !==''){
          console.log("messageIsNotNull")
          self.ShowAlert(true)
        } else {
          console.log("messageIsNull")
          self.ShowAlert(false)
        }
      })
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/sass/Admin/AdminCurrentList.scss";
</style>