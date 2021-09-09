const settings = {
    state: {
        simulator: 'hub',
        apiVersion: 'v1',
        environment: 'test'
    },
    mutations: {
        CHANGE_ENVIRONMENT(state, environment) {
            state.environment = environment;
        },
        CHANGE_SIMULATOR(state, simulator) {
            state.simulator = simulator;
        },
        CHANGE_API_V(state, apiV) {
            state.apiVersion = apiV;
        }
    },
    actions: {},
    getters: {}
};

export default settings;
