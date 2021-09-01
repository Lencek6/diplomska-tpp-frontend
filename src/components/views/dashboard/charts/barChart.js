import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    mixins: [reactiveProp],
    extends: Bar,
    props: ['options'],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}