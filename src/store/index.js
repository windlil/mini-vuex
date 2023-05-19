import { createStore } from "../vuex/createStore"

export default createStore({
  state: {
    num: 0
  },
  getters: {
    add(state) {
      return state.num + 1
    }
  },
  mutations: {
    changeNum(state, newNum) {
      state.num = newNum
    }
  },
  actions: {
    asyncChangeNum(store, newNum) {
      setTimeout(() => {
        store.commit('changeNum', newNum)
      }, 2000)
    }
  }
})