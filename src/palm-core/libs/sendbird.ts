import axios, { AxiosInstance } from 'axios'
import { UTIL } from 'palm-core/libs'
import { SbMsgDataType } from 'palm-core/types'
import Config from 'palm-react-native/config'

import { SendbirdChatSDK } from '@sendbird/uikit-utils'

const APP_ID = Config.SENDBIRD_APP_ID || ''

let AppSendbirdSDK: SendbirdChatSDK
export const GetSendbirdSDK = (): SendbirdChatSDK => AppSendbirdSDK
export const SetSendbirdSDK = (sdk: SendbirdChatSDK): SendbirdChatSDK =>
  (AppSendbirdSDK = sdk)

const createSendbirdFetcher = (
  appId: string,
  apiToken: string
): AxiosInstance => {
  const client = axios.create({
    baseURL: `https://api-${appId}.sendbird.com/v3`,
    headers: { 'Api-Token': apiToken },
  })
  client.interceptors.response.use(res => res.data)
  return client
}

const createSendbirdAPI = (
  appId: string,
  apiToken: string
): {
  getSessionToken(
    userId: string,
    expires_at?: number
  ): Promise<{
    user_id: string
    token: string
    expires_at: number
  }>
} => {
  const fetcher = createSendbirdFetcher(appId, apiToken)
  const MIN = 60 * 1000
  return {
    getSessionToken(
      userId: string,
      expires_at = Date.now() + 10 * MIN
    ): Promise<{ user_id: string; token: string; expires_at: number }> {
      return fetcher.post(`/users/${userId}/token`, { expires_at })
    },
  }
}

/**
 * API_TOKEN - {@link https://sendbird.com/docs/chat/v3/platform-api/prepare-to-use-api#2-authentication}
 * This is sample code for testing or example.
 * We recommend higher that you use sendbird platform api on your server instead of the client side.
 * */
export const SendbirdAPI = createSendbirdAPI(APP_ID, 'API_TOKEN')

export const stringifyMsgData = (data: SbMsgDataType): string => {
  return JSON.stringify(data)
}

export const parseMsgData = (data: string): SbMsgDataType | undefined => {
  return UTIL.jsonTryParse<SbMsgDataType>(data)
}
