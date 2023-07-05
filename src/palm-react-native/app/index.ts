import IStorageProvider from 'palm-core/app/storage'

import { AsyncStorageProvider } from './asyncStorageProvider'

export const asyncStorageProvider: IStorageProvider = new AsyncStorageProvider()
