<template>
    <div id="login">
        <div id="login-card">
            <i class="float-start mb-2 login-text">Prijava uporabnika v sistem</i>
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
    import notification from "../../utils/notification";

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
                notification.show('Uspešna prijava uporabnika', 'success', 'Obvestilo');
            }
        }
    }
</script>

<style scoped>

    .login-text {
        color: white;
    }

    #login {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("../../../public/1989138.svg");
        background-size: cover;
    }

    #login-card {
        width: 500px;
        background-color: rgba(13, 110, 253, 0.8);
        padding: 1rem;
    }

</style>