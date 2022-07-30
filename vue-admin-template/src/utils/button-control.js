import store from '@/store'

export function hasBtnPermission(value) {
  const myBtns = store.getters.buttons
  return myBtns.indexOf(value) > -1
}
