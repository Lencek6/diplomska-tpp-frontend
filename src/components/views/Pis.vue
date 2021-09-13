<template>
  <div id="psd2-pis" class="w-100">
    <div class="card" style="text-align: left">
      <div class="card-header">
        <i class="fa fa-info-circle"></i>
        Storitev odreditve plačil
      </div>
      <div class="card-body">
        <b-row class="card-body-row-1">
          <!-- Action column -->
          <b-col class="card-body-row-1-col-actions" sm="12" md="6">
            <!-- Payment initiation -->
            <div id="payment-init" class="mb-2">
              <b>Račun plačnika</b>
              <b-input @change="getPayments" trim v-model="debtor" class="mb-2 col-xl-5"></b-input>
              <b>Račun prejemnika</b>
              <b-input trim v-model="creditor" class="mb-2 col-xl-5"></b-input>
              <b>Agent prejemnika</b><br>
              <b-select :options="creditorAgentOptions" trim v-model="creditorAgentSelected"
                        class="mb-2 col-xl-5"></b-select>
              <br v-if="creditorAgentSelected !== null">
              <b-input placeholder="Vnesite poljubnega creditor agenta..." v-if="creditorAgentSelected === null"
                       class="col-xl-5" v-model="creditorAgent"></b-input>
              <b>Znesek transakcije</b>
              <b-input trim v-model="value" type="number" class="mb-2 col-xl-5"></b-input>
              <b>Plačilni produkt</b><br>
              <b-select v-model="paymentProduct" class="mb-2 col-xl-5"
                        :options="['sepa-credit-transfers', 'instant-sepa-credit-transfers', 'target-2-payments', 'cross-border-credit-transfers']"></b-select>
              <br>
              <b>Plačilna storitev</b><br>
              <b-select v-model="paymentService" class="mb-2 col-xl-5"
                        :options="['payments', 'bulk-payments', 'periodic-payments']"></b-select>
              <br>
              <!-- If normal payment: date of payment is needed -->
              <div v-if="paymentService === 'payments'">
                <b>Datum izvedbe plačila</b><br>
                <date-pick :format="format" id="dtp-pay-date" class="mb-2" v-model="paymentDate"
                           :weekdays="weekdays"
                           :months="months" nextMonthCaption="Naprej" prevMonthCaption="Nazaj"
                           setTimeCaption="Nastavi čas" :inputAttributes="{readonly: true}"></date-pick>
                <br>
              </div>
              <!-- If periodic payment service: start and end date is needed -->
              <div v-if="paymentService === 'periodic-payments'">
                <b>Datum ponovitve</b><br>
                Od:
                <date-pick :format="format" id="dtp-from" class="mb-2" v-model="dateFrom"
                           :weekdays="weekdays"
                           :months="months" nextMonthCaption="Naprej" prevMonthCaption="Nazaj"
                           setTimeCaption="Nastavi čas" :inputAttributes="{readonly: true}"></date-pick>
                <br>
                Do:
                <date-pick :format="format" id="dtp-to" class="mb-2" v-model="dateTo"
                           :weekdays="weekdays"
                           :months="months" nextMonthCaption="Naprej" prevMonthCaption="Nazaj"
                           setTimeCaption="Nastavi čas" :inputAttributes="{readonly: true}"></date-pick>
              </div>
              <!-- If bulk payment service: additional creditor accounts may be needed -->
              <div v-if="paymentService === 'bulk-payments'">
                <b>Dodatne transakcije</b>
                <div class="d-inline-flex w-100 mb-2">
                  <b-input v-model="bulkPaymentTmpCreditor" trim placeholder="Račun prejemnika" style="margin-right: 1rem"></b-input>
                  <b-input v-model="bulkPaymentTmpCreditorAgent" trim style="margin-right: 1rem"
                           placeholder="Agent prejemnika"></b-input>
                  <b-input v-model="bulkPaymentTmpValue" trim style="margin-right: 1rem" type="number" placeholder="Znesek"></b-input>
                  <b-button @click="addBulkPaymentTrx" variant="custom-buttons">+</b-button>
                </div>
                <div id="bulk-pymt-acc" class="mb-2">
                  <div v-for="(acc,index) in bulkPayments" :key="acc.index">
                    {{acc.creditor}} {{acc.creditorAgent}} {{acc.value}}
                    <b-icon icon="trash" @click="removeBulkPaymentTrx(index)" class="custom-del-icon"></b-icon>
                  </div>
                </div>
              </div>
              <b-button variant="custom-buttons" @click="paymentInitiation">Izvedba plačila</b-button>
            </div>
            <!-- Payment status -->
            <div id="payment-status" class="border-top">
              <multiselect v-model="selectedPayment" :options="paymentOptions" :searchable="true"
                           selectLabel="Izberi plačilo" deselectLabel="Odstrani izbiro"
                           placeholder="Izberi plačilo" :customLabel="({paymentId}) => {return paymentId}"
                           class="custom-multiselects mt-2" :close-on-select="true" id="sel-payment">
                <template slot="noOptions"><i style="color: red">Za prikaz vrednosti vnesite debtor account z izvedenimi
                  plačili</i></template>
              </multiselect>
              <b-button @click="paymentActions('details')" class="mt-2" style="margin-right: 1rem" variant="custom-buttons">Podatki o plačilu
              </b-button>
              <b-button @click="paymentActions('status')" class="mt-2" style="margin-right: 1rem" variant="custom-buttons">Status plačila</b-button>
              <b-button @click="paymentActions('sca')" class="mt-2" style="margin-right: 1rem" variant="custom-buttons">Status SCA</b-button>
              <b-button @click="deletePayment" class="mt-2" variant="custom-buttons">Preklic plačila</b-button>
            </div>
          </b-col>
          <!-- Logger column -->
          <b-col class="card-body-row-1-col-logs">
            <Logger :logs="logs" @clear-logs="clearLogs"></Logger>
          </b-col>
        </b-row>
        <!-- Display data modal -->
        <b-modal
                id="modal-display-data"
                ref="displayDataModal"
                centered
                hide-header-close
                no-stacking
                hide-footer>
          <template v-slot:modal-title>
            Rezultat klica
          </template>
          <b-table stacked v-if="displayData" :items="[...displayData]">
          </b-table>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
  import Logger from "./logger/Logger";
  import psd2_api from "../../vuex/api/psd2";
  import notification from "../../utils/notification";
  import Multiselect from 'vue-multiselect';
  import DatePick from "vue-date-pick";
  import calendar from "../../utils/calendar";
  import 'vue-date-pick/dist/vueDatePick.css';

  const timer = ms => new Promise(res => setTimeout(res, ms));
  export default {
    name: "Pis",
    components: {Logger, Multiselect, DatePick},
    data() {
      return {
        bulkPayments: [],
        bulkPaymentTmpValue: null,
        bulkPaymentTmpCreditor: null,
        bulkPaymentTmpCreditorAgent: null,
        dateFrom: "",
        dateTo: "",
        paymentDate: "",
        format: calendar.format(),
        weekdays: calendar.weekdays(),
        months: calendar.months(),
        creditorAgent: null,
        creditorAgentSelected: 'HAABSI20',
        selectedPayment: null,
        paymentOptions: [],
        logs: [],
        displayData: null,
        debtor: null,
        creditor: null,
        value: null,
        paymentService: 'payments',
        paymentProduct: 'sepa-credit-transfers',
        apiCallInProgress: false,
        creditorAgentOptions: [
          {value: 'HAABSI20', text: 'ADDIKO BANK d.d.'},
          {value: 'BAKOSI20', text: 'BANKA INTESA SANPAOLO d.d.'},
          {value: 'BSLJSI20', text: 'BANKA SLOVENIJE'},
          {value: 'KSPKSI20', text: 'BANKA SPARKASSE d.d.'},
          {value: 'BFKKSI20', text: 'BKS BANK AG'},
          {value: 'HDELSI20', text: 'DELAVSKA HRANILNICA d.d.'},
          {value: 'SZKBSI20', text: 'DEZELNA BANKA SLOVENIJE d.d.'},
          {value: 'GORESI20', text: 'GORENJSKA BANKA d.d.'},
          {value: 'HLONSI20', text: 'LON BANKA d.d.'},
          {value: 'KBMASI20', text: 'NOVA KREDITNA BANKA MARIBOR d.d.'},
          {value: 'LJBASI20', text: 'NOVA LJUBLJANSKA BANKA d.d.'},
          {value: 'HKVISI20', text: 'PRIMORSKA HRANILNICA d.d.'},
          {value: 'SABRSI20', text: 'SBERBANK BANKA d.d.'},
          {value: 'SKBASI20', text: 'SKB BANKA d.d.'},
          {value: 'BACXSI20', text: 'UNICREDIT BANKA SLOVENIJA d.d.'},
          {value: null, text: 'OSTALO'}
        ]
      }
    },
    methods: {
      // clear logs
      clearLogs() {
        this.logs = [];
        this.apiCallInProgress = false;
      },
      // Delete payment
      async deletePayment() {
        if (!this.selectedPayment) return notification.show('Plačilo mora biti izbrano', 'warn', 'Napaka validacije');
        if (!this.apiCallInProgress) {
          this.apiCallInProgress = true;
          // Payment cancellation initiation
          this.logs.push({message: 'Začetek preklica plačila', status: 'loading'});
          let result = await psd2_api.deletePayment(this.selectedPayment.paymentId);
          if (result.success) {
            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
            window.open(result.url);
            this.logs.push({message: 'Zahteva se avtorizacija preklica', status: 'loading'});
            // Authorization of cancellation
            let i = 1;
            for (i; i <= 20; i++) { // Give user 1 minute for SCA
              let pingResult = await psd2_api.commonScaPing(result.scf)
              if (pingResult.success) { // Code authorization completed
                this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                break;
              }
              await timer(3000);
            }
            if (i > 20) { // Code authorization was unsuccessful
              this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
            } else { // code authorization was unsuccessful
              this.logs.push({message: 'Preklic plačila uspešen', status: 'done'});
            }
          } else { // Payment cancellation initation was unsuccessful
            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
            this.logs.push({message: 'Preklic plačila neuspešen', status: 'failed'});
          }
          this.apiCallInProgress = false;
        } else {
          notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
        }
      },
      // Remove bulk payment trx
      removeBulkPaymentTrx(index) {
        this.bulkPayments.splice(index, 1);
      },
      // Add bulk payment trx
      addBulkPaymentTrx() {
        if (this.bulkPaymentTmpCreditor === '' || this.bulkPaymentTmpCreditor === null) return notification.show('Polje creditor account je obvezeno', 'warn', 'Napaka validacije');
        if (this.bulkPaymentTmpCreditorAgent === '' || this.bulkPaymentTmpCreditorAgent === null) return notification.show('Polje creditor agent je obvezno', 'warn', 'Napaka validacije');
        if (this.bulkPaymentTmpValue === '' || this.bulkPaymentTmpValue === null) return notification.show('Polje znesek je obvezno', 'warn', 'Napaka validacije');
        if (parseInt(this.bulkPaymentTmpValue) <= 0) return notification.show('Polje znesek mora biti pozitivno število', 'warn', 'Napaka validacije');
        this.bulkPayments.push({
          creditor: this.bulkPaymentTmpCreditor,
          creditorAgent: this.bulkPaymentTmpCreditorAgent,
          value: this.bulkPaymentTmpValue
        });
      },
      // Payment actions
      async paymentActions(action) {
        if (!this.selectedPayment) return notification.show('Plačilo mora biti izbrano', 'warn', 'Napaka validacije');
        this.displayData = null;
        if (!this.apiCallInProgress) {
          this.apiCallInProgress = true;
          if (this.selectedPayment) {
            this.logs.push({
              message: (action === 'sca') ? 'Pridobivanje SCA statusa plačila' : (action === 'details') ? 'Pridobivanje podatkov o plačilu' : 'Priodbivanje statusa plačila',
              status: 'loading'
            });
            this.displayData = await psd2_api.paymentActions(this.selectedPayment.paymentId, action);
            if (this.displayData) {
              this.$set(this.logs[this.logs.length - 1], 'status', 'done');
              this.$refs.displayDataModal.show();
            } else {
              this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
            }
          }
          this.apiCallInProgress = false;
        } else {
          notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
        }
      },
      // Get payments (On iban change)
      async getPayments() {
        this.paymentOptions = await psd2_api.getPayments(this.debtor || 'undefined');
      },
      // Payment initiation
      async paymentInitiation() {
        let dateNow = new Date(Date.now());
        dateNow.setHours(0, 0, 0);
        // Form validation
        if (this.paymentService === 'periodic-payments') {
          if (this.dateFrom === '' && this.dateTo === '') return notification.show('Datumska podatka od in do sta obvezna', 'warn', 'Napaka validacije');
          if (new Date(this.dateFrom) < dateNow) return notification.show('Datum od mora biti večji ali enak današnjemu', 'warn', 'Napaka validacije');
          if (new Date(this.dateTo) < dateNow) return notification.show('Datum do mora biti večji ali enak današnjemu', 'warn', 'Napaka validacije');
          if (this.dateFrom > this.dateTo) return notification.show('Datum od ne sme biti večji od datuma do', 'warn', 'Napaka validacije');
        }
        if (this.paymentService === 'payments') {
          if (this.paymentDate === '') return notification.show('Datum izvedbe plačila je obvezen', 'warn', 'Napaka validacije');
          if (new Date(this.paymentDate) < dateNow) return notification.show('Datum izvedbe plačila do mora biti večji ali enak današnjemu', 'warn', 'Napaka validacije');
        }
        if (this.debtor === '' || !this.debtor) return notification.show('Polje debtor account je obvezeno', 'warn', 'Napaka validacije');
        if (this.creditor === '' || !this.creditor) return notification.show('Polje creditor account je obvezeno', 'warn', 'Napaka validacije');
        if (!this.creditorAgentSelected && (this.creditorAgent === null || this.creditorAgent === '')) return notification.show('Polje creditor agent je obvezeno', 'warn', 'Napaka validacije');
        if (!this.value || this.value === '' || !(parseInt(this.value) > 0)) return notification.show('Podatek znesek transakcije mora biti večji od 0 in je obvezen', 'warn', 'Napaka validacije');

        if (!this.apiCallInProgress) {
          this.apiCallInProgress = true;
          // Payment init
          this.logs.push({message: 'Iniciacija plačila', status: 'loading'});
          let paymentInit = await psd2_api.paymentInitiation(this.debtor, this.creditor, this.creditorAgent || this.creditorAgentSelected, parseInt(this.value), this.paymentService, this.paymentProduct, (this.paymentService === 'periodic-payments') ? this.dateFrom : null, (this.paymentService === 'periodic-payments') ? this.dateTo : null, (this.paymentService === 'bulk-payments') ? this.bulkPayments : null, this.paymentDate);
          // Successful api payment initiation api call or no valid token
          if (paymentInit.success) {
            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
            // No valid token
            if (!paymentInit.token) {
              this.logs.push({
                message: 'Token ne obstaja ali ni validen. Pridobivanje avtorizacijske kode',
                status: 'loading'
              });
              // Get Code
              window.open(paymentInit.url);
              let i = 1;
              for (i; i <= 20; i++) { // Give user 1 minute for SCA
                let pingResult = await psd2_api.scaPing(paymentInit.flowId, 'pay');
                if (pingResult.success) { // Code authorization completed
                  this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                  break;
                }
                await timer(3000);
              }
              if (i > 20) { // Code authorization was unsuccessful
                this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
              } else { // Code authorization is successful
                this.logs.push({message: 'Izmenjava avtorizacijske kode za token', status: 'loading'});
                let codeExchange = await psd2_api.pisExchangeCodeForToken(paymentInit.flowId);
                if (codeExchange.success) {
                  this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                  this.apiCallInProgress = false;
                  await this.paymentInitiation();
                } else {
                  this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                }
              }
            } else {
              if (paymentInit.sca) { // SCA required
                this.logs.push({message: 'Zahteva se avtorizacija plačila', status: 'loading'});
                window.open(paymentInit.sca); // SCA redirect
                let j = 0;
                for (j; j <= 100; j++) { // User has 5 minutes to authorize call
                  let pingResult = await psd2_api.commonScaPing(paymentInit.scfId);
                  if (pingResult.success) { // Authorization is approved
                    this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                    break;
                  }
                  await timer(3000);
                }
                if (j > 100) { // Authorization was unsuccessful
                  this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                  this.logs.push({message: 'Plačilo izvedeno z neuspešno avtorizacijo', status: 'done'});
                  this.paymentOptions.unshift({id: paymentInit.payment.id, paymentId: paymentInit.payment.paymentId});
                } else {
                  this.logs.push({message: 'Plačilo izvedeno', status: 'done'});
                  this.paymentOptions.unshift({id: paymentInit.payment.id, paymentId: paymentInit.payment.paymentId});
                }
              } else { // No SCA required
                this.logs.push({message: 'Plačilo izvedeno brez avtorizacije', status: 'done'});
              }
            }
          } else { // Payment initiation errors
            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
          }
          await this.getPayments(); // Refresh payments
          this.apiCallInProgress = false;
        } else {
          notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
        }
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

  select {
    border: 1px solid #ced4da;
    height: 38px;
    border-radius: 5px;
  }

  .card-body-row-1-col-actions {
    text-align: left;
  }

  div >>> .modal-body {
    white-space: pre-line;
    overflow-y: auto;
  }

  #bulk-pymt-acc {
    max-height: 100px;
    overflow-y: auto;
  }

  /* multiselect placeholder settings */
  .custom-multiselect >>> .multiselect__placeholder {
    color: #adadad;
    display: inline-block;
    margin-bottom: 10px;
    padding-top: 0px;
    font-size: 14px;
  }

  div >>> .vdpComponent > input {
    height: 36px;
    border-radius: 5px;
    border: solid #e3e2e2 1px;
    outline: 0 !important;
    box-shadow: none !important;
    font-size: 15px;
  }

  .custom-del-icon {
    color: red;
  }

  .custom-del-icon:hover {
    -webkit-transform: scale(1.2);
    cursor: pointer;
  }

</style>
