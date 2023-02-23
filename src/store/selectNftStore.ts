import { atom } from 'recoil'
import { Moralis } from 'types'
import storeKeys from './storeKeys'

const selectedNftList = atom<Moralis.NftItem[]>({
  key: storeKeys.selectNft.selectedNftList,
  default: [],
})

export default {
  selectedNftList,
}
