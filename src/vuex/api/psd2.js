import axios from 'axios'
import utilities from "../../utils/utilities";
import store from "../store";

export default {

    // This is a custom header that specify which simulator is targeted on back-end
    customHeaders() {
        let header = {
            Simulator: store.state.settings.simulator,
            ApiVersion: store.state.settings.apiV
        };
        return header;
    },

    // Auth
    async getCode() {
        const response = await axios.get('/code', {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);

        return response.data
    },

    // SCA ping
    async scaPing(flowId, action) {
        const response = await axios.get(`/sca/ping/${action}/${flowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/auth`, headers: this.customHeaders()});
        return response.data
    },

    // Swap code for token
    async codeForTokenSwap(authFlowId) {
        const response = await axios.get(`/code/swap/${authFlowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);
        return response.data
    },

    // Create consent
    async createConsent(authFlowId) {
        const response = await axios.get(`/consent/create/${authFlowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Get consent status
    async consentStatus(authFlowId) {
        const response = await axios.get(`/consent/status/${authFlowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Get consents
    async getConsents() {
        const response = await axios.get(`/consent/get`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);
        return response.data
    },

    // Delete consent
    async deleteConsent(authFlowId) {
        const response = await axios.delete(`/consent/${authFlowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Account list
    async accountList(authFlowId) {
        const response = await axios.get(`/account/list/${authFlowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Account information
    async accountInformation(authFlowId, accountId) {
        const response = await axios.get(`/account/information/${authFlowId}/${accountId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Account balances
    async accountBalances(authFlowId, accountId) {
        const response = await axios.get(`/account/balances/${authFlowId}/${accountId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Transaction list
    async transactionList(authFlowId, accountId, from, to, bookSts) {
        const response = await axios.get(`/account/transaction/list/${authFlowId}/${accountId}/${from}/${to}/${bookSts}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/ais`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // Common SCA flow ping
    async commonScaPing(scaFlowId) {
        const response = await axios.get(`/common/sca/ping/scaFlow/${scaFlowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/auth`, headers: this.customHeaders()});
        return response.data
    },

    // PIS - Payment initiation
    async paymentInitiation(debtor, creditor, creditorAgent, value, paymentService, paymentProduct, from, to, bulk ,paymentDate) {
        const response = await axios.post(`/payment/initiation`, {debtor, creditor, creditorAgent, value, paymentService, paymentProduct, from, to, bulk, paymentDate}, {baseURL: `${process.env.VUE_APP_TPP}/tpp/pis`, headers: this.customHeaders()});
        if (response.data.success === false) utilities.handleError(response.data.message);
        return response.data
    },

    // PIS - Swap code for token
    async pisExchangeCodeForToken(flowId) {
        const response = await axios.get(`/exchange/${flowId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/pis`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);
        return response.data
    },

    // PIS - Get payments
    async getPayments(iban) {
        const response = await axios.get(`/payments/${iban}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/pis`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);
        return response.data
    },

    // PIS - Payment actions
    async paymentActions(paymentId, action) {
        const response = await axios.get(`/payment/${paymentId}/${action}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/pis`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);
        return response.data
    },

    // PIS - Delete payment
    async deletePayment(paymentId) {
        const response = await axios.delete(`/payment/${paymentId}`, {baseURL: `${process.env.VUE_APP_TPP}/tpp/pis`, headers: this.customHeaders()});
        if (response.data.success === false) return utilities.handleError(response.data.message);
        return response.data
    },

}
