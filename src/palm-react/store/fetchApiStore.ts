import { atom } from 'recoil'

import storeKeys from './storeKeys'

const isFetchingPostApiStore = atom<boolean>({
  key: storeKeys.fetchApi.isFetchingPostApi,
  default: false,
})
const isFetchingPutApiStore = atom<boolean>({
  key: storeKeys.fetchApi.isFetchingPutApi,
  default: false,
})
const isFetchingDelApiStore = atom<boolean>({
  key: storeKeys.fetchApi.isFetchingDelApi,
  default: false,
})

export default {
  isFetchingPostApiStore,
  isFetchingPutApiStore,
  isFetchingDelApiStore,
}
