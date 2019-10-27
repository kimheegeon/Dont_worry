export default {
  namespaced: true,
  state: {
    WaterQ: ''
  },

  getters: {
    WaterQ: state => {
      return state.WaterQ
    }
  },

  mutations: {
    setWaterQ (state, currentWaterQ) {
      state.WaterQ = currentWaterQ
    }
  }
}
