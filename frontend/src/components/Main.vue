<template>
  <div id="app">
    <div class="main" v-if="WaterQ == 0">
     <p class="title">아주 좋음</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/smiley.png">
    </div>
    <div class="main" v-else-if="WaterQ == 1">
     <p class="title">보통</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/neutral.png">
    </div>
    <div class="main" v-else-if="WaterQ == 2">
     <p class="title">나쁨</p>
     <p><img class="location" src="../assets/image/location.png">{{location}}</p>
     <img class="mainicon" src="../assets/image/sadsmiley.png">
    </div>
     <p class="set_location"><a href="#/Search">내 주변 지하수 위치 설정하기</a></p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      WaterQ: 2,
      location:"제주시 한림읍 225",
    }
  },
  methods: {
    checkApi: function() {

    }
  },
  created() {
    this.checkApi()
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/top.scss";
</style>
