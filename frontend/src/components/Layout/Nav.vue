<template>
  <div class="nav">
    <nav class="navbar navbar-expand-md bg-white fixed-top">
      <!-- on일때만 표시 -->
      <button v-on:click="fire" type="button" class="btn-sidemenu" data-toggle="modal"><img src="../../assets/image/sidemenu.png" /></button>
      <transition name="show">
        <div class="sidemenu" v-if="sidemenu_flag==true">
          <div class="sideTop">
            <button class="sidemenu-end" v-on:click="fire"><img src="../../assets/image/arrow_back.png"/></button>
          </div>
          <ul>
            <li v-on:click="moveToTop">수질 확인하기</li>
            <li v-on:click="moveToWrite">악취 신고하기</li>
          </ul>
          <div class="sidewords">
            <p>Version 0.0.1</p>
          </div>
        </div>
      </transition>
    </nav>
  </div>
</template>
<script>

export default {
  name: 'Navbar',
  data() {
    return {
      sidemenu_flag: false,
    }
  },
  methods:{
    fire: function() {
        if(!this.sidemenu_flag){
          this.sidemenu_flag = true
        } else {
          this.sidemenu_flag = false
        }
    },
    moveToTop: function(){
        this.sidemenu_flag = false
        this.$router.push({
            path: '/Main'
        })
    },
    moveToWrite: function(){
        this.sidemenu_flag = false
        this.$router.push({
            path: '/SendMail'
        })
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/sass/nav.scss";
</style>
