import { utils } from 'ethers'
import { ApiEnum, ApiParamFabricated, ContractAddr } from 'types'

export default {
  [ApiEnum.AUTH_CHALLENGE_REQUEST]: {
    post: (): ApiParamFabricated =>
      '/auth/challenge/request' as ApiParamFabricated,
  },
  [ApiEnum.AUTH_CHALLENGE_VERIFY]: {
    post: (): ApiParamFabricated =>
      '/auth/challenge/verify' as ApiParamFabricated,
  },

  [ApiEnum.ASSETS]: {
    get: ({
      userAddress,
      connectedNetworkId,
      limit,
      cursor,
    }: {
      userAddress: ContractAddr
      connectedNetworkId: number
      limit?: number
      cursor?: string
    }): ApiParamFabricated => {
      return `/api/evm-api-proxy/${userAddress}/nft?chain=${utils.hexValue(
        connectedNetworkId
      )}&media_items=true&limit=${limit || 10}${
        cursor ? `&cursor=${cursor}` : ''
      }` as ApiParamFabricated
    },
  },
  [ApiEnum.COLLECTIONS]: {
    get: ({
      userAddress,
      connectedNetworkId,
      limit,
      cursor,
    }: {
      userAddress: ContractAddr
      connectedNetworkId: number
      limit?: number
      cursor?: string
    }): ApiParamFabricated =>
      `/api/evm-api-proxy/${userAddress}/nft/collections?chain=${utils.hexValue(
        connectedNetworkId
      )}&limit=${limit || 10}${
        cursor ? `&cursor=${cursor}` : ''
      }` as ApiParamFabricated,
  },
  [ApiEnum.ACCOUNTS]: {
    get: (): ApiParamFabricated => '/accounts' as ApiParamFabricated,
    post: (): ApiParamFabricated => '/accounts' as ApiParamFabricated,
    put: (): ApiParamFabricated => '/accounts' as ApiParamFabricated,
    del: (): ApiParamFabricated => '/accounts' as ApiParamFabricated,
  },
  [ApiEnum.IPFS]: {
    post: (): ApiParamFabricated =>
      '/api/evm-api-proxy/ipfs/uploadFolder' as ApiParamFabricated,
  },

  [ApiEnum.SEARCH]: {
    post: (): ApiParamFabricated => '/search/all' as ApiParamFabricated,
  },
}
