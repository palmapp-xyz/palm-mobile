import { User } from 'palm-core/types'
import { atom } from 'recoil'

import storeKeys from './storeKeys'

const user = atom<User | undefined>({
  key: storeKeys.app.user,
  default: undefined,
})

const loading = atom<boolean>({
  key: storeKeys.app.loading,
  default: false,
})

export default {
  user,
  loading,
}
