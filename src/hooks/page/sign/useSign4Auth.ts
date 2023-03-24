import useMoralisRequestMessage from 'hooks/api/useMoralisRequestMessage'
import useApi from 'hooks/complex/useApi'
import useWeb3 from 'hooks/complex/useWeb3'
import useAuth from 'hooks/independent/useAuth'
import { getPkey } from 'libs/account'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import { ApiEnum, SupportedNetworkEnum } from 'types'

export type UseSign4AuthReturn = {
  signMessage: string
  onPress: () => Promise<void>
}

const useSign4Auth = (chain: SupportedNetworkEnum): UseSign4AuthReturn => {
  const { user, setAccToken } = useAuth()
  const { signMessage } = useMoralisRequestMessage({
    userAddress: user?.address,
  })

  const { postApi } = useApi()
  const { web3 } = useWeb3(chain)

  const onPress = async (): Promise<void> => {
    try {
      const pKey = await getPkey()
      const account = web3.eth.accounts.privateKeyToAccount(pKey)
      const signature = account.sign(signMessage).signature

      const fetchRes = await postApi<ApiEnum.MORALIS_AUTH_ISSUE_TOKEN>({
        path: apiV1Fabricator[ApiEnum.MORALIS_AUTH_ISSUE_TOKEN].post(),
        params: {
          networkType: 'evm',
          message: signMessage,
          signature,
        },
      })

      if (fetchRes.success) {
        setAccToken(fetchRes.data.result.idToken)
      }
    } catch (error) {}
  }

  return { signMessage, onPress }
}

export default useSign4Auth
