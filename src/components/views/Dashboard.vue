<template>
  <div id="dashboard" class="w-100">
    <b-row>
      <b-col md="12" lg="6">
        <div class="card">
          <div class="card-header" style="text-align: left">
            Ostali podatki
          </div>
          <div class="card-body" style="text-align: left">
            Število prijavljenih uporabnikov: <b>{{Math.floor(Math.random() * 100)}}</b><br>
            Število aktivnih soglasij: <b>{{Math.floor(Math.random() * 15)}}</b><br>
            Število danes zavrnjenih plačil: <b>{{Math.floor(Math.random() * 33)}}</b>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col class="payments-per-day-column">
            <payments-per-day></payments-per-day>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
            <payment-values-per-day></payment-values-per-day>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import PaymentsPerDay from "./dashboard/PaymentsPerDay";
  import PaymentValuesPerDay from "./dashboard/paymentValuesPerDay";
export default {
name: "Dashboard",
  components: {
    PaymentValuesPerDay,
  PaymentsPerDay
  }
}
</script>

<style scoped>
</style>