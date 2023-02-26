export enum PostTxStatus {
  POST = 'POST',
  BROADCAST = 'BROADCAST',
  DONE = 'DONE',
  ERROR = 'ERROR',
  READY = 'READY',
}

type StreamReady = {
  status: PostTxStatus.READY
}
type StreamPost = {
  status: PostTxStatus.POST
}
type StreamBroadcast = {
  status: PostTxStatus.BROADCAST
  transactionHash: string
}
type StreamDone = {
  status: PostTxStatus.DONE
  value?: {
    transactionHash: string
  }
}
type StreamError = {
  status: PostTxStatus.ERROR
  error: unknown
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
