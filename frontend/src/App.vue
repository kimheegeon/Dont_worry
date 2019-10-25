<template>
  <div id="app">
    <router-view/>
    <sidemenu/>
  </div>
</template>

<script>
import Nav from '../src/components/Layout/Nav'

export default {
  name: 'App',
  components: {
    'sidemenu':Nav
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
