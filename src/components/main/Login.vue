<template>
  <div id="login">
    <div id="login-card">
      <i class="float-start mb-2">Prijava uporabnika v sistem</i>
      <div class="login-card-form">
        <!-- Username -->
        <b-input-group>
          <template #prepend>
            <b-input-group-text><strong>
              <b-icon icon="person"></b-icon>
            </strong></b-input-group-text>
          </template>
          <b-form-input v-model="userName" placeholder="Uporabniško ime"></b-form-input>
        </b-input-group>
        <!-- Password -->
        <b-input-group class="mt-2">
          <template #prepend>
            <b-input-group-text><strong>
              <b-icon icon="key"></b-icon>
            </strong></b-input-group-text>
          </template>
          <b-form-input v-model="password" placeholder="Geslo"></b-form-input>
        </b-input-group>
        <b-button @click="login" class="mt-2 float-start">prijava</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      userName: null,
      password: null
    }
  },
  methods: {
    login() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>

#login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#login-card {
  width: 500px;
  background-color: #e59d9d;
  padding: 1rem;
}

</style>