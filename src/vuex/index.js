import { reactive } from "vue"

//工具函数
function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key))
}

//实现state和getters的响应式
function resetState(store, state) {
  store._state = reactive({ data: state }) //vue3提供的方法，使用reactive包裹的数据会变为响应式
  store.getters = {}
  forEachValue(store._wrapperGetters, (getter, key) => {
    Object.defineProperty(store.getters, key, {
      get: () => getter(store.state),
    })
  })
}

//用于安装mutations和actions
function installModule(store, options) {
  const mutations = options.mutations
  forEachValue(mutations, (mutation, key) => {
    store._mutations[key] = (payload) => {
      mutation(store.state, payload)
    }
  })

  const actions = options.actions
  forEachValue(actions, (action, key) => {
    store._actions[key] = (payload) => {
      let res = action(store, payload) //获取action函数的返回值
      if (!isPromise(res)) {
        return Promise.resolve(res) //如果使用者并没有给定Promise作为返回值，则在此手动创建一个并返回
      }
      return res
    }
  })
}

//用于判断参数是否为promise
function isPromise(res) {
  return res && typeof res?.then === "function"
}

export class Store {
  constructor(options) {
    const store = this
    const state = options.state
    store._wrapperGetters = options.getters
    store._mutations = Object.create(null)
    store._actions = Object.create(null)
    //调用resetState方法实现state的响应式
    resetState(store, state)
    //调用installModule方法，来安装mutations和actions
    installModule(store, options)
  }
  //访问器 使用$store.state的时候可以访问到store._state
  get state() {
    return this._state.data
  }

  commit = (type, payload) => {
    if (!this._mutations[type]) return //判断当前是否有该类型的mutation，没有的话结束函数
    this._mutations[type](payload)
  }

  dispatch = (type, payload) => {
    if (!this._actions[type]) return
    let res = this._actions[type](payload)
    return res
  }

  install(app) {
    app.provide("store", this) //vue3提供的方法，为所有组件提供一个可以使用的实例，后续通过inject方法注入到组件当中。
    app.config.globalProperties.$store = this //将$store添加到全局当中，可以通过$store.xxx来使用mini-vuex
  }
}
