import { ApiEnum, TrueOrErrReturn } from 'types'
import useApi from './useApi'
import apiV1Fabricator from 'libs/apiV1Fabricator'

type UseIpfsReturn = {
  uploadFolder: (
    items: {
      path: string
      content: object
    }[]
  ) => Promise<TrueOrErrReturn<{ path?: string }[]>>
}

const useIpfs = (): UseIpfsReturn => {
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
      data: params,
    })
    if (fetchResult.success) {
      return { success: true, value: fetchResult.data }
    } else {
      return { success: false, errMsg: fetchResult.errMsg }
    }
  }

  return { uploadFolder }
}

export default useIpfs
