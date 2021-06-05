<template>
  <div id="header">
    <b-icon @click="logOut" class="icon-user" variant="danger" icon="x-square"></b-icon>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push('/login');
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

.icon-user {
  margin-left: auto;
}

.icon-user:hover {
  -webkit-transform: scale(1.3);
  cursor: pointer;
}

/* Header under 500px */

@media only screen and (max-width: 500px) {

  #header {
    padding-left: 0;
  }

}

</style>