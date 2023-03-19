import { ApiEnum, ContractAddr, SupportedNetworkEnum } from 'types'

import useNetwork from '../complex/useNetwork'
import useApi from '../complex/useApi'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import useReactQuery from 'hooks/complex/useReactQuery'

export type UseMoralisRequestMessageReturn = {
  signMessage: string
  profileId: string
}

const useMoralisRequestMessage = ({
  userAddress,
}: {
  userAddress?: ContractAddr
}): UseMoralisRequestMessageReturn => {
  const { postApi } = useApi()
  const { connectedNetworkParams } = useNetwork()
  const connectedNetworkParam =
    connectedNetworkParams[SupportedNetworkEnum.ETHEREUM]

  const {
    data = {
      id: '',
      message: '',
      profileId: '',
    },
  } = useReactQuery(
    [ApiEnum.MORALIS_AUTH_REQUEST_MESSAGE, userAddress, connectedNetworkParam],
    async () => {
      if (userAddress) {
        const path =
          apiV1Fabricator[ApiEnum.MORALIS_AUTH_REQUEST_MESSAGE].post()
        const fetchResult = await postApi<ApiEnum.MORALIS_AUTH_REQUEST_MESSAGE>(
          {
            path,
            params: {
              data: {
                networkType: 'evm',
                address: userAddress,
                chain: connectedNetworkParam.chainId,
              },
            },
          }
        )
        if (fetchResult.success) {
          return fetchResult.data.result
        }
      }
    },
    {
      enabled: !!userAddress,
    }
  )

  return { signMessage: data.message, profileId: data.profileId }
}

export default useMoralisRequestMessage
