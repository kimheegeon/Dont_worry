<template>
  <div class="app" :class="classObject">
    <router-view/>
    <!-- <sidemenu/> -->
  </div>
</template>

<script>
import Nav from '../src/components/Layout/Nav'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      color_flg:'',
      isActive: false,
      error: false
    }
  },
  components: {
    'sidemenu':Nav
  },
  methods: {
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
    },
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

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
.app.active {
  background-color: #fdff7f
}
.app.active2 {
  background-color: #fcb8f3
}
.app.active3 {
  background-color: hsl(73, 73%, 78%)
}
</style>
