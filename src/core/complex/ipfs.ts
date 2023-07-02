import axios from 'axios'
import apiV1Fabricator from 'core/libs/apiV1Fabricator'
import { resolveIpfsUri } from 'core/libs/ipfs'
import { recordError } from 'core/libs/logger'
import { ApiEnum, TrueOrErrReturn } from 'core/types'

import { apiManager } from './api'

export const getIpfs = async <T>(uri: string): Promise<T | null> => {
  const resolvedUrl = resolveIpfsUri(uri)

  try {
    const axiosData = await axios.get<T>(resolvedUrl)
    const ret: T | undefined = axiosData.data
    return ret
  } catch (e) {
    recordError(e, 'useIpfs:fetch')
  }
  return null
}

export const uploadFolder = async (
  items: {
    path: string
    content: object
  }[]
): Promise<TrueOrErrReturn<{ path?: string }[]>> => {
  const apiPath = apiV1Fabricator[ApiEnum.IPFS].post()
  const params = items.map((item: { path: string; content: object }) => ({
    path: item.path,
    content: Buffer.from(JSON.stringify(item.content)).toString('base64'),
  }))

  const fetchResult = await apiManager.post<ApiEnum.IPFS>({
    path: apiPath,
    params,
  })

  if (fetchResult.success) {
    return { success: true, value: fetchResult.data }
  } else {
    return { success: false, errMsg: fetchResult.errMsg }
  }
}
