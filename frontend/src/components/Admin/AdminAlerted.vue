<template>
    <div id="AlertedList">
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
                <tr v-for="(data, index) in AlertedList" :key="index">
                <td v-for="(value, key) in columns" :key="key">
                    <p v-if="key=='AREA'">{{ data[key] }}</p>
                    <p v-if="key=='CONTENTS'">{{ data[key] }}</p>
                    <p v-if="key=='USER'">{{ data[key] }}</p>
                    <p v-if="key=='DATE'">{{ data[key] | moment("YYYY-MM-DD HH:mm:ss") }}</p>
                </td>
                </tr>
            </table>
            <vue-loading type="spiningDubbles" v-if="loadingFlag" color="#3cb4d3" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <!-- <paginate v-if="!loadingFlag" v-model="pageNum" :hide-prev-next="true" :page-count="totalPage" :page-range="10" :margin-pages="2" :click-handler="updateResource" :prev-text="'이전'" :next-text="'다음'" :container-class="'pagination'" :page-class="'page-item'">
            </paginate> -->
        </div>
        <ErrorModal v-if="showModalError" @close="closeErrModal" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
    </div>
</template>

<script>
import AdminBaseModal from '../Modal/AdminBaseModal'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import 'moment/locale/ko'
import axios from 'axios'

var DATE_FORMAT = "LL"

export default {
  name: 'CurrentList',
  data() {
    return {
      columns: {
        AREA: '지역',
        USER: '신고자 정보',
        CONTENTS: '신고내역',
        DATE: '날짜 및 날씨 정보'
      },
      keyword: "",
      start_date:"",
      end_date:"",
      AlertedList: [
      /* { 
        AREA: '제주 한림읍 225', 
        CONTENTS: '지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..지하수 상태 좋음이라는데 냄새가 너무 심해요..',
        USER: 'yyy@gmail.com',
        DATE: '2019/10/28'
       },
       { 
        AREA: '제주 한림읍 225', 
        CONTENTS: '악취 겁나구림',
        USER: 'yyy1111@gmail.com',
        DATE: '2019/10/28'
       },
       { 
        AREA: '제주 한림읍 225', 
        CONTENTS: '이상한냄새가 나요',
        USER: 'yyy2222@gmail.com',
        DATE: '2019/10/28'
       },
       { 
        AREA: '제주 한림읍 225', 
        CONTENTS: '앱이 안움직여요',
        USER: 'yyy@gmail.com',
        DATE: '2019/10/28'
       }*/
      ],
      offset: 0,
      limit: 10,
      totalPage: 0,
      loadingFlag: false,
      pageNum: 1,
      showModalError: false,
      modalErrTitle: '',
      modalErrMessage: ''
    }
  },
  components: {
     'ErrorModal': AdminBaseModal,
     'datepicker': Datepicker
  },
  created: function() {
    this.getAlertedList()
  },
  mounted() {
    var area = document.getElementById('start_date')
    area.classList.add('form-control');
    area.setAttribute("style", "background-color: #FFFFFF; height: 40px;");
    var area2 = document.getElementById('end_date')
    area2.classList.add('form-control');
    area2.setAttribute("style", "background-color: #FFFFFF; height: 40px;");
  },
  methods: {
    getAlertedList: function() {
      this.loadingFlag = true
      if(this.start_date !== "" ){
        this.start_date = moment(this.start_date).format("YYYY-MM-DD 00:00:00")
      }
      if(this.end_date !== ""){
        this.end_date = moment(this.end_date).format("YYYY-MM-DD 23:59:59")
      }
      axios.get('http://127.0.0.1:3000/report/alertList', {
        params:{
          FREE_WORD: this.keyword,
          START_DATE: '2019-05-05',
          END_DATE:'2019-11-07'
          // START_DATE: this.start_date,
          // END_DATE:this.end_date,
          // LIMIT: this.limit,
          // OFFSET: this.offset,
        }
      }).then(response => {
        var res = JSON.parse(response.data)
        console.log(res)
        //로딩표시 제거
        this.loadingFlag = false
        if(res.STATUS_CODE == '00'){
          if(Object.keys(res.AlertedList).length > 0){
            this.AlertedList = res.AlertedList;
            // this.totalPage = Math.ceil(res.AlertedList_COUNT / this.limit) //신고데이터 총 갯수 서버에서 획득
            // this.offset = this.offset + this.limit
          } else {
            this.AlertedList = []
            this.totalPage = 0
          }
        } else {
          this.modalErrTitle = '신고데이터 획득 실패'
          this.modalErrMessage = '신고데이터 획득에 실패했습니다.'
          this.showModalError = true
        }
      })
    },
    execSearch: function() {
      // 데이터 클린
      this.offset = 0
      this.pageNum = 1
      this.AlertedList = []
      // 검색
      this.getAlertedList()
    },
    updateResource: function(pageNum) {
      this.offset = (pageNum - 1) * 10
      this.pageNum = pageNum
      this.getAlertedList()
    },
    setDateFormat(date) {
      return moment(date).format(DATE_FORMAT);
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/sass/Admin/AdminAlerted.scss";
</style>