<template>
    <div id="CountList">
        <div class="search_info">
            <form class="form-user">
                <div class="form-group">
                    <input type="text" v-model="keyword" placeholder="양돈가 위치" value="">
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
                <tr v-for="data in CountList" :key="data.value">
                <td v-for="(value, key, index) in columns" :key="index">
                    <p v-if="key=='AREA'">{{ data[key] }}</p>
                    <p v-if="key=='COUNT'">{{ data[key] }}</p>
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

var DATE_FORMAT = "LL"

export default {
  name: 'CurrentList',
  data() {
    return {
      columns: {
        AREA: '양돈가 위치',
        COUNT: '사육두수',
        DATE: '날짜'
      },
      keyword: "",
      start_date:"",
      end_date:"",
      CountList: [
       { 
        AREA: '한림1가 양돈가', 
        COUNT: '2590',
        DATE: '2019/10/28'
       },
       { 
        AREA: '한림2가 양돈가', 
        COUNT: '2700',
        DATE: '2019/10/28'
       },
       { 
        AREA: '한림3가 양돈가', 
        COUNT: '2700',
        DATE: '2019/10/28'
       },
       { 
        AREA: '한림4가 양돈가', 
        COUNT: '2800',
        DATE: '2019/10/28'
       },
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
    getCountList: function() {
      this.loadingFlag = true
      if(this.start_date !== "" ){
        this.start_date = moment(this.start_date).format("YYYY-MM-DD 00:00:00")
      }
      if(this.end_date !== ""){
        this.end_date = moment(this.end_date).format("YYYY-MM-DD 23:59:59")
      }
      axios.get('http://127.0.0.1:3000/pig/count', {
        FREE_WORD: this.keyword,
        START_DATE: this.start_date,
        END_DATE:this.end_date,
        LIMIT: this.limit,
        OFFSET: this.offset,
      }).then(response => {
        //로딩표시 제거
        this.loadingFlag = false
        if(response.data.STATUS_CODE == '00'){
          if(Object.keys(response.data.CountList).length > 0){
            this.CountList = response.data.CountList;
            this.totalPage = Math.ceil(response.data.CountList_COUNT / this.limit) //신고데이터 총 갯수 서버에서 획득
            this.offset = this.offset + this.limit
          } else {
            this.CountList = []
            this.totalPage = 0
          }
        } else {
          this.modalErrTitle = '사육두수 데이터 획득 실패'
          this.modalErrMessage = '사육두수 데이터 획득에 실패했습니다.'
          this.showModalError = true
        }
      })
    },
    execSearch: function() {
      // 데이터 클린
      this.offset = 0
      this.pageNum = 1
      this.CountList = []
      // 검색
      this.getCountList()
    },
    updateResource: function(pageNum) {
      this.offset = (pageNum - 1) * 10
      this.pageNum = pageNum
      this.getCountList()
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