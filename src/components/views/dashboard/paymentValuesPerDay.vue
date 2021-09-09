<template>
    <div id="max-payment-per-day">
        <div class="card">
            <div class="card-header text-start">
                Skupni znesek izvedenih plačil zadnjih {{n}} dni
            </div>
            <div class="card-body">
                <div class="text-start">
                <b>Število dni</b><br>
                10 <b-input id="input" @change="generateChart" v-model="n" :min="min" :max="max" type="range" class="w-50"></b-input> 100
                </div>
                <bar-chart class="mt-1" :options="barOptions" :chartData="barData"></bar-chart>
            </div>
        </div>
    </div>
</template>

<script>
    import BarChart from "./charts/barChart";
    import chartUtilities from "./charts/chartUtilities";
    import psd2_api from "../../../vuex/api/psd2";

    export default {
        name: "paymentValuesPerDay",
        components: {
            BarChart
        },
        data() {
            return {
                min: 10,
                max: 100,
                n: 100, // Initial number of elements on bar chart
                barOptions: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: 2000
                            }
                        }]
                    }
                },
                barData: {}
            }
        },
        methods: {
            // Generate chart data
            async generateChart() {
                let number = parseInt(this.n);
                let result = await psd2_api.lastNDaysPaymentValuesCount(number);
                let data = new Array(number).fill(0);
                let labels = chartUtilities.lastNDays(number)
                for (let val of result) {
                    let idx = labels.findIndex(el => el === val.createdOn)
                    if (idx !== -1) data[idx] = val.totalValue;
                }
                this.barData = {
                    labels: labels,
                    datasets: [{
                        label: 'Znesek plačil',
                        data: data,
                        backgroundColor: 'rgba(13, 110, 253, 0.59)',
                        borderColor: 'rgba(13, 110, 253)',
                        borderWidth: 1
                    }]
                }
            },
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
