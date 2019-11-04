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
                <tr v-for="data in WaterQList" :key="data.value">
                <td v-for="(value, key, index) in columns" :key="index">
                    <p v-if="key=='Number'">{{ data[key] }}</p>
                    <p v-if="key=='AREA'" @click="ShowWaterQ(data['Number'],data['AREA'],data['DATE'])">{{ data[key] }}</p>
                    <p v-if="key=='WATERQ'" @click="ShowWaterQ(data['Number'],data['AREA'],data['DATE'])">{{ data[key] }}</p>
                    <p v-if="key=='DATE'" @click="ShowWaterQ(data['Number'],data['AREA'],data['DATE'])">{{ data[key] | moment("YYYY-MM-DD HH:mm:ss") }}</p>
                </td>
                </tr>
            </table>
            <vue-loading type="spiningDubbles" v-if="loadingFlag" color="#3cb4d3" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <!-- <paginate v-if="!loadingFlag" v-model="pageNum" :hide-prev-next="true" :page-count="totalPage" :page-range="10" :margin-pages="2" :click-handler="updateResource" :prev-text="'이전'" :next-text="'다음'" :container-class="'pagination'" :page-class="'page-item'">
            </paginate> -->
        </div>
        <AdminDetailModal v-if="showModalDetail" @close="closeDetailModal(false)" @complete="closeDetailModal(true)" :current_no="current_no" :address="address" :search_date="search_date"></AdminDetailModal>
        <ErrorModal v-if="showModalError" @close="closeErrModal" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
    </div>
</template>

<script>
import AdminBaseModal from '../Modal/AdminBaseModal'
import AdminDetailModal from '../Modal/AdminDetailModal'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import 'moment/locale/ko'

var DATE_FORMAT = "LL"

export default {
  name: 'CurrentList',
  data() {
    return {
      columns: {
        Number:'NO.',
        AREA: '지역',
        WATERQ: '수질 데이터',
        DATE: '날짜 및 날씨 정보'
      },
      keyword: "",
      start_date:"",
      end_date:"",
      WaterQList:[],
      /*WaterQList: [
       {
        Number:1,
        AREA: '제주 한림읍 225', 
        WATERQ: '기준치 초과',
        DATE: '2019/10/28'
       },
       {
        Number:2,
        AREA: '제주 한림읍 223', 
        WATERQ: '정상 범위내',
        DATE: '2019/10/28'
       },
       {
        Number:3,
        AREA: '제주 한림읍 223', 
        WATERQ: '정상 범위내',
        DATE: '2019/10/28'
       },
       {
        Number:4,
        AREA: '제주 한림읍 223', 
        WATERQ: '정상 범위내',
        DATE: '2019/10/28'
       },
       {
        Number:5,
        AREA: '제주 한림읍 223', 
        WATERQ: '정상 범위내',
        DATE: '2019/10/28'
       }
      ],*/
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
      showModalDetail: false
    }
  },
  components: {
     'AdminDetailModal': AdminDetailModal,
     'ErrorModal': AdminBaseModal,
     'datepicker': Datepicker
  },
  created: function() {

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
    getWaterQList: function() {
      this.loadingFlag = true
      if(this.start_date !== "" ){
        this.start_date = moment(this.start_date).format("YYYY-MM-DD 00:00:00")
      }
      if(this.end_date !== ""){
        this.end_date = moment(this.end_date).format("YYYY-MM-DD 23:59:59")
      }
      axios.post('http://127.0.0.1:3000/water/WaterQList', {
        FREE_WORD: this.keyword,
        START_DATE: this.start_date,
        END_DATE:this.end_date,
        LIMIT: this.limit,
        OFFSET: this.offset,
      }).then(response => {
        //로딩표시 제거
        this.loadingFlag = false
        if(response.data.STATUS_CODE == '00'){
          if(Object.keys(response.data.WaterQList).length > 0){
            this.WaterQList = response.data.WaterQList;
            this.totalPage = Math.ceil(response.data.WaterQList_COUNT / this.limit) //수질데이터 총 갯수 서버에서 획득
            this.offset = this.offset + this.limit
          } else {
            this.WaterQList = []
            this.totalPage = 0
          }
        } else {
          this.modalErrTitle = '수질데이터 획득 실패'
          this.modalErrMessage = '수질데이터 획득에 실패했습니다.'
          this.showModalError = true
        }
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
    ShowWaterQ(number, address, date) {
      this.current_no = number
      this.address = address
      this.search_date = date
      this.showModalDetail = true
    },
    closeDetailModal: function(coumplete){
      this.showModalDetail = false
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/sass/Admin/AdminCurrentList.scss";
</style>