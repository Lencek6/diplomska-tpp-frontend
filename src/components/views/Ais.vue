<template>
    <div id="psd2-ais" class="w-100">
        <div class="card">
            <div class="card-header" style="text-align: left">
                <i class="fa fa-user"></i>
                Account information service
            </div>
            <div class="card-body">
                <b-row class="card-body-row-1">
                    <!-- Action column -->
                    <b-col class="card-body-row-1-col-actions" sm="12" md="6">
                        <!-- Get consent -->
                        <div class="border-bottom">
                            <b-button variant="custom-buttons" class="mb-2" @click="getConsent">Kreiraj novo soglasje</b-button>
                        </div>
                        <!-- Consent status or consent removal -->
                        <multiselect v-model="selectedConsent" :options="consentOptions" :searchable="true"
                                     selectLabel="Izberi soglasje" deselectLabel="Odstrani izbiro"
                                     :customLabel="({consentId}) => {return consentId}" placeholder="Izberi soglasje"
                                     class="custom-multiselect mt-3" :close-on-select="true" id="sel-consent">
                            <template slot="noOptions"><i style="color: red">Napaka na strežniku</i>
                            </template>
                            <template slot="noResult"><i style="color: red">Ni zadetka za iskani niz!</i></template>
                        </multiselect>
                        <div class="mt-3">
                            <b-button class="mb-2" variant="custom-buttons" style="margin-right: 1rem" @click="consentStatus">Stanje soglasja</b-button>
                            <b-button class="mb-2" @click="deleteConsent" variant="custom-buttons" >Prekliči soglasje</b-button>
                            <br>
                        </div>
                        <!-- Get account list -->
                        <b-button variant="custom-buttons" class="mt-1 mb-2" @click="getAccList">Read account list</b-button>
                        <div class="border-top">
                            <multiselect v-model="selectedAcc" :options="accList" :searchable="true"
                                         selectLabel="Izberi račun" deselectLabel="Odstrani izbiro"
                                         :customLabel="({name, resourceId}) => {return `${name} - ${resourceId}`}"
                                         placeholder="Izberi račun"
                                         class="custom-multiselect mt-3" :close-on-select="true" id="sel-acc">
                                <template slot="noOptions"><i style="color: red">Za pridobitev računov najprej izvedite klic "Read
                                    account list"</i>
                                </template>
                                <template slot="noResult"><i style="color: red">Ni zadetka za iskani niz!</i></template>
                            </multiselect>
                            <!-- Get account information -->
                            <b-button variant="custom-buttons" class="mt-3" @click="getAccInformation">Read account details
                            </b-button>
                        </div>
                        <div class="mt-3 border-bottom">
                            <b-button class="mb-2" variant="custom-buttons" @click="getAccBalances">Read balance</b-button>
                        </div>
                        <!-- Transaction list -->
                        <div class="mt-3">
                            <b-button variant="custom-buttons" @click="getTransactionList" class="mb-3">Read transaction list</b-button>
                            <br>
                            <!-- Date from -->
                            Transakcije od:
                            <date-pick :format="format" id="dtp-from" class="mb-2" v-model="dateFrom"
                                       :weekdays="weekdays"
                                       :months="months" nextMonthCaption="Naprej" prevMonthCaption="Nazaj"
                                       setTimeCaption="Nastavi čas" :inputAttributes="{readonly: true}"></date-pick>
                            <br>
                            <!-- Date to -->
                            Transakcije do:
                            <date-pick :format="format" id="dtp-to" class="mb-2" v-model="dateTo"
                                       :weekdays="weekdays"
                                       :months="months" nextMonthCaption="Naprej" prevMonthCaption="Nazaj"
                                       setTimeCaption="Nastavi čas" :inputAttributes="{readonly: true}"></date-pick>
                            <!-- Booking status -->
                            <multiselect v-model="selectedBookSts" :options="['booked', 'pending']" :searchable="true"
                                         selectLabel="Izberi booking status" deselectLabel="Odstrani izbiro"
                                         placeholder="Izberi booking status"
                                         class="custom-multiselects" :close-on-select="true" id="sel-booking-status">
                            </multiselect>
                        </div>
                    </b-col>
                    <!-- Logger column -->
                    <b-col class="card-body-row-1-col-logs mt-md-0 mt-4">
                        <Logger @clear-logs="clearLogs" :logs="logs"></Logger>
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

    export default {
        name: "Ais",
        components: {Logger, Multiselect, DatePick},
        data() {
            return {
                dateFrom: "",
                dateTo: "",
                format: calendar.format(),
                weekdays: calendar.weekdays(),
                months: calendar.months(),
                logs: [],
                actionInProgress: false,
                consentOptions: [],
                selectedConsent: null,
                accList: [],
                selectedAcc: null,
                displayData: null,
                selectedBookSts: null,
            }
        },
        methods: {
            // clear logs
            clearLogs(){
                this.logs = [];
                this.actionInProgress = false;
            },
            // Get transaction list
            async getTransactionList() {

                // Is booking status selected
                if (this.selectedBookSts === null) return notification.show('Booking status mora biti za pregled liste transakcij izbran', 'warn', 'Obvestilo');

                // Are dates from to selected
                if (this.dateFrom === "" || this.dateTo === "") return notification.show('Datuma transakcije od in transakcije do morata biti za pregled liste transakcij izbrana', 'warn', 'Obvestilo');

                // Date from must be older than date to
                if (this.dateFrom > this.dateTo) return notification.show('Datum transakcije od ne sme biti večji od datuma transakcije do', 'warn', 'Obvestilo');

                const timer = ms => new Promise(res => setTimeout(res, ms));

                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    if (this.selectedAcc && this.selectedConsent) { // Consent and account must be selected
                        // Step 1: call transaction list api
                        this.logs.push({message: 'Pridobivanje lista transakcij', status: 'loading'})
                        let tranList = await psd2_api.transactionList(this.selectedConsent.authorizationFlow.id, this.selectedAcc.resourceId, this.dateFrom, this.dateTo, this.selectedBookSts);
                        // If Step 1 is successful
                        if (tranList.success) {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                            // Step 2:
                            // Check if sca is required (Transaction list for more than 90 days)
                            if (tranList.scaRequired) {
                                this.logs.push({
                                    message: 'Zahteva se vpogled večji od 90 dni. Potrebna avtorizacija.',
                                    status: 'loading'
                                });
                                window.open(tranList.url); // SCA redirect
                                let j = 0;
                                for (j; j <= 100; j++) { // User has 5 minutes to authorize call
                                    let pingResult = await psd2_api.commonScaPing(tranList.scfId);
                                    if (pingResult.success) { // Consent is approved
                                        this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                                        break;
                                    }
                                    await timer(3000);
                                }
                                if (j > 100) { // Consent approval was unsuccessful
                                    this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                                } else { // Consent was successful - repeat same call to get transaction list for more than 90 days
                                    this.actionInProgress = false;
                                    await this.getTransactionList();
                                }
                            } else { // If SCA is not required display data
                                this.displayData = tranList.data;
                                this.$refs.displayDataModal.show()
                            }
                        } else { // If step 1 is unsuccessful
                            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                        }
                    } else {
                        notification.show('Za izvedbo pridobitve lista transakcij je potrebno izbrati račun in veljavno soglasje', 'warn', 'Obvestilo');
                    }
                    this.actionInProgress = false; // At the end of the call
                } else {
                    notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
                }
            },
            // Get account balances information
            async getAccBalances() {
                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    if (this.selectedAcc && this.selectedConsent) {
                        this.logs.push({message: 'Pridobivanje informacij o stanju na računu', status: 'loading'})
                        let accBal = await psd2_api.accountBalances(this.selectedConsent.authorizationFlow.id, this.selectedAcc.resourceId)
                        if (accBal.success) {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                            this.displayData = accBal.data.balances;
                            this.$refs.displayDataModal.show()
                        } else {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                        }
                    } else {
                        notification.show('Za izvedbo pridobitve informacije o stanju na računu je najprej potrebno izbrati račun in veljavno soglasje', 'warn', 'Obvestilo');
                    }
                    this.actionInProgress = false;
                } else {
                    notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
                }
            },
            // Get account information
            async getAccInformation() {
                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    if (this.selectedAcc && this.selectedConsent) {
                        this.logs.push({message: 'Pridobivanje informacij o računu', status: 'loading'})
                        let accInfo = await psd2_api.accountInformation(this.selectedConsent.authorizationFlow.id, this.selectedAcc.resourceId)
                        if (accInfo.success) {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                            this.displayData = accInfo.data;
                            this.$refs.displayDataModal.show()
                        } else {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                        }
                    } else {
                        notification.show('Za izvedbo pridobitve informacije o računu je najprej potrebno izbrati račun in veljavno soglasje', 'warn', 'Obvestilo');
                    }
                    this.actionInProgress = false;
                } else {
                    notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
                }
            },
            // Get account list
            async getAccList() {
                this.accList = [];
                this.selectedAcc = null;
                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    if (this.selectedConsent) {
                        this.logs.push({message: 'Pridobivanje seznama računov', status: 'loading'})
                        let accList = await psd2_api.accountList(this.selectedConsent.authorizationFlow.id);
                        if (accList.success) {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                            this.accList = accList.data.accounts;
                        } else {
                            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                        }
                    } else {
                        notification.show('Za izvedbo pridobitve informacije o seznamu računov je najprej potrebno izbrati soglasje', 'warn', 'Obvestilo');
                    }
                    this.actionInProgress = false;
                } else {
                    notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
                }
            },
            // Delete consent
            async deleteConsent() {
                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    if (this.selectedConsent) {
                        let delConsent = await psd2_api.deleteConsent(this.selectedConsent.authorizationFlow.id); // Delete consent - on success this method returns no data...
                        if (delConsent.success) {
                            let consentStatus = await psd2_api.consentStatus(this.selectedConsent.authorizationFlow.id) // ...That is why we need to check consent status after deletion
                            if (consentStatus.success) {
                                this.logs.push({message: `Soglasje ${consentStatus.consentId} preklicano. Njegovo stanje je: ${consentStatus.status}`});
                            }
                        }
                    } else {
                        notification.show('Za izvedbo preklica soglasja je najprej potrebno izbrati soglasje', 'warn', 'Obvestilo');
                    }
                    this.actionInProgress = false;
                } else {
                    notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
                }

            },
            // Get consent status
            async consentStatus() {
                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    if (this.selectedConsent) {
                        let result = await psd2_api.consentStatus(this.selectedConsent.authorizationFlow.id);
                        if (result.success) {
                            this.logs.push({message: `Status soglasja ${result.consentId} je: ${result.status}`});
                        }
                    } else {
                        notification.show('Za izvedbo stanja soglasja je najprej potrebno izbrati soglasje', 'warn', 'Obvestilo');
                    }
                    this.actionInProgress = false;
                } else {
                    notification.show('Eden od API klicev že v teku. Počakajte na njegovo izvedbo.', 'warn', 'Obvestilo');
                }
            },
            // Get consent from user
            async getConsent() {

                const timer = ms => new Promise(res => setTimeout(res, ms));

                if (!this.actionInProgress) {
                    this.actionInProgress = true;
                    this.logs.push({message: 'Pridobivanje avtorizacijske kode', status: 'loading'});
                    // Step 1: Get authorization code
                    let result = await psd2_api.getCode();
                    if (result) {
                        window.open(result.url); // SCA
                        let i = 1;
                        for (i; i <= 20; i++) { // Give user 1 minute for SCA
                            let pingResult = await psd2_api.scaPing(result.authFlowId, 'sca')
                            if (pingResult.success) { // SCA is completed
                                this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                                break;
                            }
                            await timer(3000);
                        }
                        if (i > 20) { // SCA was unsuccessful
                            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                        } else { // SCA was successful
                            // Step 2: Change authorization code for token
                            this.logs.push({message: 'Izmenjava avtorizacijske kode za token', status: 'loading'});
                            let swapResult = await psd2_api.codeForTokenSwap(result.authFlowId);
                            if (swapResult.success) { // Code swap was successful
                                this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                                // Step 3: Consent creation
                                this.logs.push({message: 'Pridobivanje soglasja', status: 'loading'});
                                let createConsent = await psd2_api.createConsent(result.authFlowId);
                                if (createConsent.success) { // Create consent call was successful
                                    this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                                    // Step 4: Consent creation approval
                                    this.logs.push({message: 'Avtorizacija soglasja', status: 'loading'});
                                    window.open(createConsent.url);
                                    let j = 0;
                                    for (j; j <= 100; j++) { // User has 5 minutes to approve consent
                                        let pingResult = await psd2_api.scaPing(result.authFlowId, 'consent');
                                        if (pingResult.success) { // Consent is approved
                                            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                                            break;
                                        }
                                        await timer(3000);
                                    }
                                    if (j > 100) { // Consent approval was unsuccessful
                                        this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                                    } else { // Consent approval was successful
                                        // Step 5: Check consent state
                                        this.logs.push({message: 'Preverjanje statusa soglasja', status: 'loading'});
                                        let consentStatus = await psd2_api.consentStatus(result.authFlowId);
                                        if (consentStatus.success) {
                                            this.$set(this.logs[this.logs.length - 1], 'status', 'done');
                                            this.logs.push({message: `Status soglasja ${consentStatus.consentId} je: ${consentStatus.status}`});
                                        } else {
                                            this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                                        }
                                    }
                                } else { // Create consent call was unsuccessful
                                    this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                                }
                            } else { // Code swap was unsuccessful
                                this.$set(this.logs[this.logs.length - 1], 'status', 'failed');
                            }
                        }
                    }
                    // At the end of the flow
                    this.actionInProgress = false;
                    await this.getConsents(); // Update consents
                } else {
                    notification.show('Pridobivanje soglasja že v teku', 'warn', 'Obvestilo');
                }
            },
            // Get consents list from backend
            async getConsents() {
                this.consentOptions = await psd2_api.getConsents();
            }
        },
        async created() {
            await this.getConsents();
        }
    }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

    .card-body-row-1-col-actions {
        text-align: left;
    }

    div >>> .modal-body{
        white-space: pre-line;
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

</style>
