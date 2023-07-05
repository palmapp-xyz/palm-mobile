// eslint-disable-next-line prettier/prettier
import {
  asyncStorageProvider,
} from 'palm-react-native/app/asyncStorageProvider'

import { development, LensClient } from '@lens-protocol/client'

export const lensClient = new LensClient({
  environment: development,
  storage: asyncStorageProvider(),
})
