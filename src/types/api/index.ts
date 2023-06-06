export * from './accounts'
export * from './channels'
export * from './fetch'
export * from './friends'
export * from './moralis'
export * from './servers'
export * from './transaction'

export type Item = {
  chainId?: number
}

export type ItemsFetchResult<T extends Item> = {
  result: T[]
  chainId?: number
}
