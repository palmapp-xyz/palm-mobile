import { utils } from 'ethers'
import { ApiEnum, ApiParamFabricated, ContractAddr } from 'types'

export default {
  [ApiEnum.MORALIS_AUTH_REQUEST_MESSAGE]: {
    post: (): ApiParamFabricated =>
      '/ext-moralis-auth-requestMessage' as ApiParamFabricated,
  },
  [ApiEnum.MORALIS_AUTH_ISSUE_TOKEN]: {
    post: (): ApiParamFabricated => '/v1/jwt/issue' as ApiParamFabricated,
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
      return `/v1/api/evm-api-proxy/${userAddress}/nft?chain=${utils.hexValue(
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
      `/v1/api/evm-api-proxy/${userAddress}/nft/collections?chain=${utils.hexValue(
        connectedNetworkId
      )}&limit=${limit || 10}${
        cursor ? `&cursor=${cursor}` : ''
      }` as ApiParamFabricated,
  },
  [ApiEnum.AUTH]: {
    post: (): ApiParamFabricated => '/v1/auth' as ApiParamFabricated,
    put: (): ApiParamFabricated => '/v1/auth' as ApiParamFabricated,
    del: (): ApiParamFabricated => '/v1/auth' as ApiParamFabricated,
  },
  [ApiEnum.ACCOUNTS]: {
    get: (): ApiParamFabricated => '/v1/accounts' as ApiParamFabricated,
    post: (): ApiParamFabricated => '/v1/accounts' as ApiParamFabricated,
    put: (): ApiParamFabricated => '/v1/accounts' as ApiParamFabricated,
    del: (): ApiParamFabricated => '/v1/accounts' as ApiParamFabricated,
  },
}
