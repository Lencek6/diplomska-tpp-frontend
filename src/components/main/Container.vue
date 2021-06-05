<template>
  <div id="container">
    <!-- Header, Footer, Navigation and views -->
    <Header></Header>
    <Navigation></Navigation>
    <!-- Views -->
    <div id="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/main/container/Navigation";
import Header from "@/components/main/container/Header";

export default {
  name: "Container",
  components: {Header, Navigation}
}
</script>

<style scoped>

#main {
  display: flex;
  margin-left: 200px;
  padding-top: 50px;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Main view under 500px */

@media only screen and (max-width: 500px) {

  #main {
    display: flex;
    margin-left: 0;
    padding-top: 50px;
    padding-left: 1rem;
    padding-right: 1rem;
  }

}

</style>