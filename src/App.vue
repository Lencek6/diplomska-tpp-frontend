<template>
  <div id="app">
    <notifications group="main"></notifications>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>

:root {
  --nav-txt: black;
  --nav-txt-hvr: rgba(13, 110, 253, 0.59);
  --nav-bg: #d4d3d3;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
