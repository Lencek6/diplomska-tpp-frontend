<template>
    <div id="login">
        <div id="login-card">
            <div class="logo">
                <img class="tpp-logo" :src="tppLogo"/>
                <h4 class="mb-2 login-text">TPP SIMULATOR</h4>
            </div>
            <div class="border-top text-start mb-2">
                <i>Prijava v sistem z domenskim uporabniškim imenom in geslom.</i>
            </div>
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
                <b-button @click="login" variant="custom-buttons" class="mt-3 float-start">prijava</b-button>
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
                password: null,
                tppLogo: require("/public/bank.svg"),
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

    .logo {
        display: flex;
        align-items: center;
        padding-bottom: 0.5rem;
    }

    .tpp-logo {
        height: 45px;
    }

    .login-text {
        padding-left: 0.5rem;
        margin-bottom: 0 !important;
        text-align: start;
        color: black;
        font-family: 'Mukta', sans-serif !important;
        font-weight: 600;
        font-size: 18px;
        text-transform: uppercase;
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
        background-color: rgb(131, 174, 241);
        padding: 1rem;
        border-radius: 5px;
    }

</style>