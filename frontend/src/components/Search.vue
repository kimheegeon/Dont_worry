<template>
  <div id="search">
    <div class="main">
     <div>
         <img class="mainicon" src="../assets/image/search.png">
         <input type="search" id="search" placeholder="시/군/구 를 입력하세요" />
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
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
@import "../assets/sass/search.scss";
</style>
