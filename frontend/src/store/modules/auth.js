export default {
  namespaced: true,
  state: {
    WaterQ: '',
    location: ''
  },

  getters: {
    WaterQ: state => {
      return state.WaterQ
    },
    location: state => {
      return state.location
    }
  },

  mutations: {
    setWaterQ (state, currentWaterQ) {
      state.WaterQ = currentWaterQ
    },
    setLocation (state, currentlocation) {
      state.location = currentlocation
    }
  }
}
