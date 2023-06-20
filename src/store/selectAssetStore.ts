import { atom } from 'recoil'
import { Moralis } from 'types'

import storeKeys from './storeKeys'

const selectedNftList = atom<Moralis.NftItem[]>({
  key: storeKeys.selectAsset.selectedNftList,
  default: [],
})

const selectedToken = atom<Moralis.FtItem | undefined>({
  key: storeKeys.selectAsset.selectedToken,
  default: undefined,
})

export default {
  selectedNftList,
  selectedToken,
}
