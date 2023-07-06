import { apiManager } from 'palm-core/complex/api'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import { recordError } from 'palm-core/libs/logger'
import { chainId } from 'palm-core/libs/network'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'

export const getTokenPrice = async ({
  tokenAddress,
  selectedNetwork,
}: {
  tokenAddress: ContractAddr
  selectedNetwork: SupportedNetworkEnum
}): Promise<Moralis.TokenPrice | undefined> => {
  const path = apiV1Fabricator[ApiEnum.TOKEN_PRICE].get({
    tokenAddress,
    connectedNetworkId: chainId(selectedNetwork),
  })
  const fetchResult = await apiManager.get<ApiEnum.TOKEN_PRICE>({ path })
  if (fetchResult.success) {
    return fetchResult.data
  } else {
    recordError(
      new Error(fetchResult.errMsg),
      `getTokenPrice ${tokenAddress} (${selectedNetwork}): ${path}`
    )
    return undefined
  }
}
