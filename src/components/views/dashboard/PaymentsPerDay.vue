<template>
    <div id="payments-per-day">
        <line-chart :chart-data="dataCollection" :options="chartOptions"></line-chart>
    </div>
</template>

<script>
    import LineChart from "./charts/lineChart"
    import chartUtilities from "./charts/chartUtilities";

    export default {
        name: "PaymentsPerDay",
        components: {
            LineChart
        },
        data() {
            return {
                dataCollection: {},
                chartOptions: {
                    maintainAspectRatio: false,
                }
            }
        },
        mounted() {
            this.dataCollection = {
                labels: chartUtilities.last7Days(),
                datasets: [{
                    label: 'Število plačil',
                    data: chartUtilities.randomNumberArray(7),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        }
    }
</script>

<style scoped>

</style>