import { asyncStorageProvider } from 'palm-react-native/app'

import { development, LensClient } from '@lens-protocol/client'

export const lensClient = new LensClient({
  environment: development,
  storage: asyncStorageProvider,
})
