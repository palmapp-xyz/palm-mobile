import axios from 'axios'
import apiV1Fabricator from 'core/libs/apiV1Fabricator'
import { resolveIpfsUri } from 'core/libs/ipfs'
import { recordError } from 'core/libs/logger'
import { ApiEnum, TrueOrErrReturn } from 'core/types'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import useApi from './useApi'

type UseIpfsReturn<T> = {
  data?: T | null
  loading: boolean
  uploadFolder: (
    items: {
      path: string
      content: object
    }[]
  ) => Promise<TrueOrErrReturn<{ path?: string }[]>>
}

const useIpfs = <T>({ uri }: { uri?: string }): UseIpfsReturn<T> => {
  const resolvedUrl = useMemo(
    () => (uri ? resolveIpfsUri(uri) : undefined),
    [uri]
  )

  const { data, isFetching } = useQuery(
    [resolvedUrl],
    async () => {
      if (!resolvedUrl) {
        return null
      }

      try {
        const axiosData = await axios.get<T>(resolvedUrl)
        const ret: T | undefined = axiosData.data
        return ret
      } catch (e) {
        recordError(e, 'useIpfs:fetch')
      }
      return null
    },
    {
      enabled: !!resolvedUrl,
    }
  )

  const { postApi } = useApi()

  const uploadFolder = async (
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

    const fetchResult = await postApi<ApiEnum.IPFS>({
      path: apiPath,
      params,
    })

    if (fetchResult.success) {
      return { success: true, value: fetchResult.data }
    } else {
      return { success: false, errMsg: fetchResult.errMsg }
    }
  }

  return { data, loading: isFetching, uploadFolder }
}

export default useIpfs
