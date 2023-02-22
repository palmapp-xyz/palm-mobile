import { atom } from 'recoil'
import { Moralis } from 'types'
import storeKeys from './storeKeys'

const selectedNft = atom<Moralis.NftItem | undefined>({
  key: storeKeys.groupChannel.selectedNft,
  default: undefined,
})

const visibleModal = atom<'sell' | 'send' | undefined>({
  key: storeKeys.groupChannel.visibleModal,
  default: undefined,
})

export default {
  selectedNft,
  visibleModal,
}
