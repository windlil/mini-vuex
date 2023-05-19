import { inject } from "vue";

export function useStore() {
  return inject('store')
}