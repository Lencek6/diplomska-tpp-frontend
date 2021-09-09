<template>
    <div id="payments-per-day">
        <div class="card">
            <div class="card-header text-start">
                Število izvedenih plačil zadnjih {{n}} dni
            </div>
            <div class="card-body">
                <div class="text-start">
                <b>Število dni</b><br>
                10 <b-input id="input" @change="generateChart" v-model="n" :min="min" :max="max" type="range" class="w-50"></b-input> 100
                </div>
                <line-chart class="mt-1" :chart-data="dataCollection" :options="chartOptions"></line-chart>
            </div>
        </div>
    </div>
</template>

<script>
    import LineChart from "./charts/lineChart";
    import chartUtilities from "./charts/chartUtilities";
    import psd2_api from "../../../vuex/api/psd2";
    export default {
        name: "PaymentsPerDay",
        components: {
            LineChart
        },
        data() {
            return {
                min: 10,
                max: 100,
                n: 100, // Initial number of elements on line chart
                dataCollection: {},
                chartOptions: {
                    maintainAspectRatio: false
                }
            }
        },
        methods: {
            // Generate chart data
            async generateChart(){
                let number = parseInt(this.n);
                let result = await psd2_api.lastNDaysPaymentCount(number);
                let labels = chartUtilities.lastNDays(number);
                let data = new Array(number).fill(0);
                for(let val of result) {
                    let idx = labels.findIndex(el => el === val.createdOn)
                    if(idx !== -1) data[idx] = val.count;
                }
                this.dataCollection = {
                    labels: labels,
                    datasets: [{
                        label: 'Število plačil',
                        data: data,
                        fill: false,
                        borderColor: 'rgba(13, 110, 253, 0.59)',
                        pointBackgroundColor: "#ffffff",
                        tension: 0.1
                    }]
                }
            }
        },
        async mounted() {
            await this.generateChart();
        }
    }
</script>

<style scoped>

    #input {
        border-radius: 5px;
        -webkit-appearance: none;
        height: 5px;
        background: #d3d3d3;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    #input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        background: rgba(13, 110, 253, 0.59);
        border-radius: 50px;
        cursor: pointer;
    }

</style>
