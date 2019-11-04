<template>
  <div class="sendmail">
    <sidemenu/>
    <main role="main" class="full-height">
      <div class="content-title text-center">악취 신고</div>
      <div class="container">
        <div class="form-wrapper">
          <form class="form-user">
            <div class="form-group form-area required">
              <label for="Location">신고 위치</label>
              <input class="form-control" v-bind:class="{ 'is-invalid': errLocation }" v-model="Location">
              <div v-if="errLocation" class="invalid-feedback">{{ errMsgLocation }}</div>
            </div>
            <div class="form-group form-area required">
              <label for="TextContent">신고 내용</label>
              <input class="form-control-contents" v-bind:class="{ 'is-invalid': errContent }"  placeholder="신고내용(지역, 날짜, 상세내역)" v-model="Contents">
              <div v-if="errContent" class="invalid-feedback">{{ errMsgContent }}</div>
            </div>
            <div class="form-group form-email required">
                <label for="exampleInputEmail">메일 주소</label>
                <input type="email" class="form-control" v-bind:class="{ 'is-invalid': errMailAddress }" placeholder="aaa@gmail.com" v-model="MAILADDRESS">
                <div v-if="errMailAddress" class="invalid-feedback">{{ errMsgMailAddress }}</div>
            </div>
            <button type="button" v-on:click.stop="SendMail()" class="btn btn-default btn-block btn-lg btn-confirm">송신</button>
          </form>
        </div>
      </div>
    </main>
  <!-- 에러 모달 -->
  <ErrorModal v-if="showModalError" @close="showModalError = false" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
  </div>
</template>

<script>
import Nav from '../../src/components/Layout/Nav'
import BaseModal from './Modal/BaseModal'
import { mapMutations,mapGetters } from 'vuex'

export default {
  name: 'SendMail',
  data() {
    return {
      Location:'',
      Contents:'',
      MAILADDRESS:'',
      errLocation: false,
      errContent: false,
      errMailAddress: false,
      errMsgLocation:'',
      errMsgContent: '',
      errMsgMailAddress: '',
      showModalError: false,
      modalErrTitle: '',
      modalErrMessage: ''
    };
  },
  components: {
    'sidemenu':Nav,
    'ErrorModal': BaseModal
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  methods: {
    SendMail: function() {
      if (!this.chkValidation()) {
        return false
      }
      var self = this
      //메일 송신 api 호출
      axios.get('http://127.0.0.1:3000/report/SendMail', {
        LOCATION: this.Location,
        CONTENTS: this.Contents,
        MAIL_ADDRESS: this.MAILADDRESS
      })
      .then(response => {
        //호출 성공시
        if(response.data.STATUS_CODE == '00'){
          this.modalErrTitle = '정상처리'
          this.modalErrMessage = '소중한 의견이 접수되었습니다.'
          this.showModalError = true
          this.$router.push({
            path: '/sendmail'
          })
        } else {
          this.modalErrTitle = '전송실패'
          this.modalErrMessage = '전송이 실패했습니다.'
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
    chkValidation: function() {
      //신고내용 유효체크
      if (this.Contents == null || this.Contents == '') {
        this.errContent = true
        this.errMsgContent = '신고내용을 기재해주세요.'
      } else {
        this.errContent = false
        this.errMsgContent = ''
      }
     //메일주소 유효체크
      if (this.MAILADDRESS == null||this.MAILADDRESS =="") {
        this.errMailAddress = true
        this.errMsgMailAddress = '메일주소를 입력해주세요.'
      } else if (!this.validEmail(this.MAILADDRESS)) {
        this.errMailAddress = true
        this.errMsgMailAddress = '정확한 메일주소를 입력해주세요.'
      } else {
        this.errMailAddress = false
        this.errMsgMailAddress = ''
      }

      if (this.errContent || this.errMailAddress) {
        return false
      } else {
        return true
      }
    },
     validEmail: function(email) {
      var res = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (res == null) {
        return false;
      } else {
        return true;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/sendmail.scss";
</style>
