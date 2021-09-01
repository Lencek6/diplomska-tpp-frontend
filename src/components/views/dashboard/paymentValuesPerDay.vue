<template>
    <div id="max-payment-per-day">
        <bar-chart :options="barOptions" :chartData="barData"></bar-chart>
    </div>
</template>

<script>
    import BarChart from "./charts/barChart"
    import chartUtilities from "./charts/chartUtilities";

    export default {
        name: "paymentValuesPerDay",
        components: {
            BarChart
        },
        data() {
            return {
                barOptions: {
                    maintainAspectRatio: false,
                },
                barData: {}
            }
        },
        mounted() {
            this.barData = {
                labels: chartUtilities.last7Days(),
                datasets: [{
                    label: 'Znesek plačila v €',
                    data: chartUtilities.randomNumberArray(7),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }]
            }
        }
    }
</script>

<style scoped>

</style>