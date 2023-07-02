import { apiManager } from 'core/complex/api'
import apiV1Fabricator from 'core/libs/apiV1Fabricator'
import { recordError } from 'core/libs/logger'
import { chainId } from 'core/libs/network'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'core/types'

export const getUserCollectionNfts = async ({
  selectedNetwork,
  userAddress,
  contractAddress,
  limit,
  cursor,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress: ContractAddr
  contractAddress: ContractAddr
  limit?: number
  cursor?: string
}): Promise<Moralis.NftItemsFetchResult> => {
  const path = apiV1Fabricator[ApiEnum.COLLECTION_ASSETS].get({
    userAddress,
    contractAddress,
    connectedNetworkId: chainId(selectedNetwork),
    limit,
    cursor,
  })
  const fetchResult = await apiManager.get<ApiEnum.COLLECTION_ASSETS>({ path })

  if (fetchResult.success) {
    fetchResult.data.result = fetchResult.data.result.filter(x => !!x)
    return fetchResult.data
  } else {
    recordError(new Error(fetchResult.errMsg), 'getUserCollectionNfts')
    return {
      page: 0,
      page_size: 0,
      cursor: null,
      result: [] as Moralis.NftItem[],
    } as Moralis.NftItemsFetchResult
  }
}
