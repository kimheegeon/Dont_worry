<template>
  <div class="nav">
    <nav class="navbar navbar-expand-md fixed-top" :class="classObject" style="position:relation;">
      <img src="../../assets/image/dontworrylogo3.png" class="adminHeaderLogo" style="width:100px; position:absolute; left: 10px; top:-20px;"/>
      <!-- on일때만 표시 -->
      <button v-on:click="fire" type="button" class="btn-sidemenu" :class="classObject" data-toggle="modal"><img src="../../assets/image/sidemenu.png" /></button>
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
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Navbar',
  data() {
    return {
      sidemenu_flag: false,
      color_flg:'',
      isActive: false,
      error: false
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
    },
    ChangeColor: function(color_flg) {
      if(color_flg == 1){
        this.isActive = false
        this.error = false
      } else if(color_flg == 2) {
        this.isActive = true
        this.error = false
      } else if(color_flg == 3) {
        this.isActive = true
        this.error = true
      } else {
        this.isActive = false
        this.error = false
      }
    }
  },
  created() {
    this.color_flg = this.WaterQ
    this.ChangeColor(this.color_flg)
  },
  computed: {
    ...mapState('auth', {
      WaterQ: function (state) {
        return state.WaterQ;
      }
    }),
    classObject:function () {
      return {
        active:!this.isActive && !this.error,
        'active2': this.isActive && !this.error,
        'active3': this.isActive && this.error
      }
    }
  },
  watch: {
    WaterQ: function(val, oldVal) {
      if(val !== oldVal && val !== ''){
        this.ChangeColor(val)
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/sass/nav.scss";
</style>
