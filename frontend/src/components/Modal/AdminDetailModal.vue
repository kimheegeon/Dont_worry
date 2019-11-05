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
                  <input type="text" v-model="WaterDetail.AREA" />
                </td>
              </tr>
              <tr>
                <th>일시</th>
                <td>
                  <input type="text" v-model="WaterDetail.DATE" />
                </td>
              </tr>
              <tr>
                <th>질산성 질소(NO3-N)</th>
                <td>
                  <input type="text" v-model="WaterDetail.NO3N" />
                </td>
              </tr>
              <tr>
              <th>황화 수소(H2S)</th>
                <td>
                  <input type="text" v-model="WaterDetail.H2S" />
                </td>
              </tr>
              <tr>
                <th>탁도</th>
                <td>
                  <input type="text" v-model="WaterDetail.Turbidity" />
                </td>
              </tr>
              <tr>
                <th>트랜잭션값</th>
                <td>
                  <input type="text" v-model="WaterDetail.transaction" />
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
    <ErrorModal v-if="showModalError" @close="closeErrModal" :title="modalErrTitle" :message="modalErrMessage"></ErrorModal>
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
      modalErrMessage: ''
    }
  },
  props: ['address', 'search_date'],
  methods: {
    getWaterDetail: function() {
      axios.get('http://127.0.0.1:3000/water/WaterDetail', {
        params:{
          // Number: this.current_no,
          AREA: this.address,
          DATE: this.search_date
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
  },
  created() {
      this.getWaterDetail()
      // this.WaterDetail.Number = this.current_no
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
