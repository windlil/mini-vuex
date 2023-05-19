<template>
  <div class="app" style="margin-top: 50px">
    <div>num: {{ num }}</div>
    <div>getters/add: {{ numAdd }}</div>
    <div class="btn">
      <button @click="$store.state.num++">num + 1</button>
      <button @click="changeNum">changeNum</button>
      <button @click="asycnChangeNum">asyncChangeNum</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useStore } from "./vuex/useStore"

const store = useStore()
const num = computed(() => store.state.num)
const numAdd = computed(() => store.getters.add)

function changeNum() {
  store.commit("changeNum", 1000)
}

function asycnChangeNum() {
  store.dispatch("asyncChangeNum", 2000)
}
</script>

<style>
.btn button {
  margin: 0 10px;
}
</style>
