<template>
  <div class="adminHeader">
    <header class="admin">
      <div class="header_logo">
        <img src="../../../assets/image/dontworry4.jpg" class="adminHeaderLogo" />
      </div>
      <div class="menu">
        <ul>
          <li>관리자 어카운트 로그인</li>
          <li><img src="../../../assets/image/img_admin_icon_logout.png" />로그아웃</li>
        </ul>
      </div>
    </header>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NavbarAdmin',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    execLogout: function(){
    //   var self = this
    //   var resultLogin = self.logout()

    //   setTimeout(function () {
    //     resultLogin.then(function(response){
    //       console.log(response)
    //       if(response.data.STATUS_CODE == '00'){
    //         self.errLogin = false
    //         self.errMessage = ""
    //         self.$router.push({ path: '/admin/login' })
    //       } else {
    //         self.errLogin = true
    //         self.errMessage = response.data.ERROR_CODE
    //       }
    //     })

    //   }, 500);
    },
   showModalLogout: function(){
    //  this.modalTitle = '로그아웃'
    //  this.modalMessage = '정말 로그아웃하시겠습니까?'
    //  this.showModalLogoutWindow = true
   },
  },
  created: function(){
  },
  mounted: function(){
  }
}
</script>

<style lang="scss">
@import "../../../assets/sass/Admin/AdminHeader.scss";
</style>
