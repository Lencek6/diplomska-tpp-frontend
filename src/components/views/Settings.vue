<template>
    <div id="settings" class="w-100">
        <div class="card">
            <div class="card-header" style="text-align: left">
                Globalne nastavitve
            </div>
            <div class="card-body" style="text-align: left">
                Verzija API-ja <br>
                <b-select class="mb-2" :options="apiOptions" v-model="apiVersion"></b-select><br>
                Simulator <br>
                <b-select class="mb-2" :options="simOptions" v-model="simulator"></b-select><br>
                Okolje <br>
                <b-select :options="envOptions" v-model="environment"></b-select>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                envOptions: ['test', 'prod'],
                apiOptions: ['v1', 'v2'],
                simOptions: ['sb', 'hub']
            }
        },
        computed: {
            environment: {
                get() {
                    return this.$store.state.settings.environment;
                },
                set(value){
                    this.$store.commit('CHANGE_ENVIRONMENT', value);
                }
            },
            apiVersion: {
                get() {
                    return this.$store.state.settings.apiVersion;
                },
                set(value) {
                    this.$store.commit('CHANGE_API_V', value);
                }
            },
            simulator: {
                get() {
                    return this.$store.state.settings.simulator;
                },
                set(value) {
                    this.$store.commit('CHANGE_SIMULATOR', value);
                }
            }
        }
    }
</script>

<style scoped>

    select {
        border: 1px solid #ced4da;
        height: 38px;
        border-radius: 5px;
    }

</style>