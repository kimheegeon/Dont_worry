<template>
<transition name="modal">
  <div class="modal-mask" id="DetailModal">
    <div class="modal-wrapper">
      <div class="modal-container DetailModal">
        <div class="modal-body">
          <slot name="body">
            <!-- 내용 -->
            <table class="DetailTable" border="0">
              <tr>
                <th>위치 정보</th>
                <td>
                  {{address}}
                </td>
              </tr>
              <tr>
                <th>일시</th>
                <td>
                  {{search_date}}
                </td>
              </tr>
              <tr>
                <th>질산성 질소(NO3-N)</th>
                <td>
                  {{WaterDetail.NO3N}}
                </td>
              </tr>
              <tr>
              <th>황화 수소(H2S)</th>
                <td>
                  {{WaterDetail.H2S}}
                </td>
              </tr>
              <tr>
                <th>탁도</th>
                <td>
                  {{WaterDetail.Turbidity}}
                </td>
              </tr>
              <tr>
                <th>트랜잭션</th>
                <td>
                  {{WaterDetail.transaction}}
                  <br>
                  <a href="#" @click="clickLink()" style="color: red;text-decoration: underline;">블록데이터 확인하기</a>
                </td>
              </tr>
            </table>
            <div class="btn-wrapper">
              <button type="button" class="btn btn-default btn-sm btn-login btn-info" @click="closeModal()">확인</button>
            </div>
          </slot>
        </div>
        <!-- /modal-body -->
      </div>
    </div>
    <ErrorModal v-if="showModalError" @close="showModalError = false" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
  </div>
</transition>
</template>

<script>
import AdminBaseModal from '../Modal/AdminBaseModal'
import { mapMutations } from 'vuex'
import axios from 'axios'

export default {
  components: {
    'ErrorModal': AdminBaseModal,
  },
  data: function() {
    return {
      WaterDetail: [],
      showModalError: false,
      modalErrTitle: '',
      modalErrMessage: '',
      url:''
    }
  },
  props: ['address', 'search_date'],
  methods: {
    getWaterDetail: function() {
      axios.get('http://127.0.0.1:3000/water/WaterDetail', {
        params:{
          AREA: "제주도북부앞바다",
          DATE: "2019-05-23 11:22:41"
        }
      }).then(response => {
        var res = JSON.parse(response.data)
        console.log(res)
        if (res.STATUS_CODE == '00') {
          this.WaterDetail = res.WaterDetail
        } else {
          this.modalErrTitle = '수질 상세내역 획득 실패'
          this.modalErrMessage = '수질 상세내역 획득에 실패했습니다.'
          this.showModalError = true
        }
      })
    },
    closeModal: function() {
      this.$emit('close')
    },
    clickLink: function (){
      var newWindow = window.open("about:blank")
      newWindow.location.href = 'https://baobab.scope.klaytn.com/tx/'+ this.WaterDetail.transaction
    }
  },
  created() {
      this.getWaterDetail()
      this.WaterDetail.AREA = this.address
      this.WaterDetail.DATE = this.search_date
  },
  mounted() {
    document.body.setAttribute("style", "overflow: hidden;");
  },
  watch: {
  }
}
</script>

<style lang="scss">
@import "../../assets/sass/Admin/Modal/AdminDetailModal.scss";
</style>
