import { TransactionReceipt } from 'web3-core'

export enum PostTxStatus {
  // POST = 'POST',
  BROADCAST = 'BROADCAST',
  DONE = 'DONE',
  ERROR = 'ERROR',
  READY = 'READY',
}

type StreamReady = {
  status: PostTxStatus.READY
}
// type StreamPost = {
//   status: PostTxStatus.POST
// }
type StreamBroadcast = {
  status: PostTxStatus.BROADCAST
  transactionHash: string
}
type StreamDone = {
  status: PostTxStatus.DONE
  value: TransactionReceipt
}
type StreamError = {
  status: PostTxStatus.ERROR
  error: unknown
}

export type StreamResultType =
  | StreamReady
  // | StreamPost
  | StreamBroadcast
  | StreamDone
  | StreamError

export type PostTxReturn =
  | {
      success: true
      receipt: TransactionReceipt
    }
  | {
      success: false
      message: string
      error?: any
    }
