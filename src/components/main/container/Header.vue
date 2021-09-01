<template>
  <div id="header">
    <img class="bankart-logo" :src="image"/>
  </div>
</template>

<script>

export default {
  name: "Header",
  data() {
    return{
      image: require('/public/bankart_logotip_color.svg')
    }
  }
}
</script>

<style scoped>

#header {
  padding-left: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-right: 1rem;
  position: absolute;
  width: 100%
}

.bankart-logo {
  height: 20px;
  margin-left: auto;
}

/* Header under 500px */

@media only screen and (max-width: 500px) {

  #header {
    padding-left: 0;
  }

}

</style>