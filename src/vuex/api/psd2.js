import axios from 'axios'
import utilities from "../../utils/utilities";
import store from "../store";

const failed = (e) => {
    utilities.handleError(e.response.data.message);
    return {success: false};
}

export default {

    customConfig(service) {
        return {
            headers: {
                'tpp-simulator': store.state.settings.simulator,
                'tpp-environment': store.state.settings.environment,
                'tpp-api-version': store.state.settings.apiVersion,
                'Authorization': localStorage.getItem('JWT')
            },
            baseURL: (service === 'ais') ? `${process.env.VUE_APP_TPP}/tpp/ais` : (service === 'pis') ? `${process.env.VUE_APP_TPP}/tpp/pis` : `${process.env.VUE_APP_TPP}/tpp/auth`,
        };
    },

    // Auth
    async getCode(iban) {
        try {
            const response = await axios.get(`/code/${iban}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            failed(e);
        }
    },

    // SCA ping
    async scaPing(flowId, action) {
        try {
            const response = await axios.get(`/sca/ping/${action}/${flowId}`, this.customConfig('auth'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Swap code for token
    async codeForTokenSwap(authFlowId) {
        try {
            const response = await axios.post(`/code/swap`, {authFlowId}, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Create consent
    async createConsent(authFlowId) {
        try {
            const response = await axios.post(`/consent`, {authFlowId}, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Get consent status
    async consentStatus(authFlowId) {
        try {
            const response = await axios.get(`/consent/status/${authFlowId}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Get consents
    async getConsents() {
        try {
            const response = await axios.get(`/consent`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            utilities.handleError(e);
            return [];
        }
    },

    // Delete consent
    async deleteConsent(authFlowId) {
        try {
            const response = await axios.delete(`/consent/${authFlowId}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Account list
    async accountList(authFlowId) {
        try {
            const response = await axios.get(`/account/list/${authFlowId}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Account information
    async accountInformation(authFlowId, accountId) {
        try {
            const response = await axios.get(`/account/information/${authFlowId}/${accountId}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Account balances
    async accountBalances(authFlowId, accountId) {
        try {
            const response = await axios.get(`/account/balances/${authFlowId}/${accountId}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Transaction list
    async transactionList(authFlowId, accountId, from, to, bookSts) {
        try {
            const response = await axios.get(`/account/transaction/list/${authFlowId}/${accountId}/${from}/${to}/${bookSts}`, this.customConfig('ais'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Common SCA flow ping
    async commonScaPing(scaFlowId) {
        try {
            const response = await axios.get(`/common/sca/ping/scaFlow/${scaFlowId}`, this.customConfig('auth'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // PIS - Payment initiation
    async paymentInitiation(debtor, creditor, creditorAgent, value, paymentService, paymentProduct, from, to, bulk, paymentDate) {
        try {
            const response = await axios.post(`/payment/initiation`, {
                debtor,
                creditor,
                creditorAgent,
                value,
                paymentService,
                paymentProduct,
                from,
                to,
                bulk,
                paymentDate
            }, this.customConfig('pis'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // PIS - Swap code for token
    async pisExchangeCodeForToken(flowId) {
        try {
            const response = await axios.get(`/exchange/${flowId}`, this.customConfig('pis'));
            return response.data
        } catch (e) {
            return failed(e);
        }
    },

    // PIS - Get payments
    async getPayments(iban) {
        try {
            const response = await axios.get(`/payments/${iban}`, this.customConfig('pis'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // PIS - Payment actions
    async paymentActions(paymentId, action) {
        try {
            const response = await axios.get(`/payment/actions/${paymentId}/${action}`, this.customConfig('pis'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // PIS - Delete payment
    async deletePayment(paymentId) {
        try {
            const response = await axios.delete(`/payment/${paymentId}`, this.customConfig('pis'));
            return response.data;
        } catch (e) {
            return failed(e);
        }
    },

    // Last n days payments count
    async lastNDaysPaymentCount(n) {
        try {
            const response = await axios.get(`/payment/count/${n}`, this.customConfig('pis'));
            return response.data;
        } catch (e) {
            failed(e);
            return [];
        }
    },

    // Last n days payment values count
    async lastNDaysPaymentValuesCount(n) {
        try {
            const response = await axios.get(`/payment/values/count/${n}`, this.customConfig('pis'));
            return response.data;
        } catch (e) {
            failed(e);
            return [];
        }
    }

}
