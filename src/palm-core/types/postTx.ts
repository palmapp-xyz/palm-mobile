import { SupportedNetworkEnum } from './network'

export enum PostTxStatus {
  POST = 'POST',
  BROADCAST = 'BROADCAST',
  DONE = 'DONE',
  ERROR = 'ERROR',
  READY = 'READY',
}

type StreamReady = {
  status: PostTxStatus.READY
  chain: SupportedNetworkEnum
}
type StreamPost = {
  status: PostTxStatus.POST
  chain: SupportedNetworkEnum
}
type StreamBroadcast = {
  status: PostTxStatus.BROADCAST
  transactionHash: string
  chain: SupportedNetworkEnum
}
type StreamDone = {
  status: PostTxStatus.DONE
  value?: {
    transactionHash: string
  }
  chain: SupportedNetworkEnum
}
type StreamError = {
  status: PostTxStatus.ERROR
  error: unknown
  chain: SupportedNetworkEnum
}

export type StreamResultType =
  | StreamReady
  | StreamPost
  | StreamBroadcast
  | StreamDone
  | StreamError

export type PostTxReturn =
  | {
      success: true
      receipt: {
        transactionHash: string
      }
    }
  | {
      success: false
      message: string
      error?: any
    }
