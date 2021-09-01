const settings = {
    state: {
        simulator: 'sb',
        apiV: 'v2'
    },
    mutations: {
        CHANGE_SIMULATOR(state, simulator) {
            state.simulator = simulator;
        },
        CHANGE_API_V(state, apiV) {
            state.apiV = apiV;
        }
    },
    actions: {},
    getters: {}
};

export default settings;
