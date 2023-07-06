import {
  PostTxStatus,
  StreamResultType,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { atom } from 'recoil'

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
