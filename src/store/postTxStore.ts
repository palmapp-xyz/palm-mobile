import { atom } from 'recoil'
import { PostTxStatus, StreamResultType, SupportedNetworkEnum } from 'types'
import storeKeys from './storeKeys'

const postTxResult = atom<StreamResultType>({
  key: storeKeys.postTx.postTxResult,
  default: {
    status: PostTxStatus.READY,
    chain: SupportedNetworkEnum.ETHEREUM,
  },
})

export default {
  postTxResult,
}
