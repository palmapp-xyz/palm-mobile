import axios, { AxiosResponse } from 'axios'
import useNetwork from 'hooks/complex/useNetwork'
// import useApi from 'hooks/complex/useApi'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import {
  ApiEnum,
  ApiResponse,
  AuthChallengeInfo,
  AuthChallengeResult,
  ContractAddr,
  SupportedNetworkEnum,
} from 'palm-core/types'

export type UseAuthChallengeReturn = {
  challengeRequest: (address: ContractAddr) => Promise<AuthChallengeInfo>
  challengeVerify: (
    signature: string,
    message: string
  ) => Promise<AuthChallengeResult>
  fetchUserProfileId: (
    userAddress: ContractAddr | undefined
  ) => Promise<string | undefined>
}

const useAuthChallenge = (
  chain?: SupportedNetworkEnum
): UseAuthChallengeReturn => {
  // const { postApi } = useApi()
  const { apiPath, connectedNetworkIds } = useNetwork()
  const connectedNetworkId =
    connectedNetworkIds[chain ?? SupportedNetworkEnum.ETHEREUM]

  const fetchUserProfileId = async (
    userAddress: ContractAddr | undefined
  ): Promise<string | undefined> => {
    if (!userAddress) {
      return undefined
    }
    const result = await challengeRequest(userAddress)
    return result.profileId
  }

  const challengeRequest = async (
    address: ContractAddr
  ): Promise<AuthChallengeInfo> => {
    const apiUrl = `${apiPath}${apiV1Fabricator[
      ApiEnum.AUTH_CHALLENGE_REQUEST
    ].post()}`

    const params = {
      address,
      chainId: connectedNetworkId,
    }

    const fetchRes: AxiosResponse<
      ApiResponse[ApiEnum.AUTH_CHALLENGE_REQUEST]['POST'],
      any
    > = await axios.post(apiUrl, params, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })

    if (fetchRes.status === 200) {
      return fetchRes.data
    } else {
      throw new Error(fetchRes.statusText)
    }
  }

  const challengeVerify = async (
    signature: string,
    message: string
  ): Promise<AuthChallengeResult> => {
    const apiUrl = `${apiPath}${apiV1Fabricator[
      ApiEnum.AUTH_CHALLENGE_VERIFY
    ].post()}`

    const params = {
      signature,
      message,
    }

    const fetchRes: AxiosResponse<
      ApiResponse[ApiEnum.AUTH_CHALLENGE_VERIFY]['POST'],
      any
    > = await axios.post(apiUrl, params, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })

    if (fetchRes.status === 200) {
      return fetchRes.data
    } else {
      throw new Error(fetchRes.statusText)
    }
  }

  // const challengeRequest = async (
  //   address: ContractAddr
  // ): Promise<AuthChallengeInfo> => {
  //   const fetchRes = await postApi<ApiEnum.AUTH_CHALLENGE_REQUEST>({
  //     path: apiV1Fabricator[ApiEnum.AUTH_CHALLENGE_REQUEST].post(),
  //     params: {
  //       address,
  //       chainId: connectedNetworkId,
  //     },
  //   })

  //   if (!fetchRes.success) {
  //     throw new Error(fetchRes.errMsg)
  //   }
  //   return fetchRes.data
  // }

  // const challengeVerify = async (
  //   signature: string,
  //   message: string
  // ): Promise<AuthChallengeResult> => {
  //   const fetchRes = await postApi<ApiEnum.AUTH_CHALLENGE_VERIFY>({
  //     path: apiV1Fabricator[ApiEnum.AUTH_CHALLENGE_VERIFY].post(),
  //     params: {
  //       signature,
  //       message,
  //     },
  //   })

  //   if (!fetchRes.success) {
  //     throw new Error(fetchRes.errMsg)
  //   }
  //   return fetchRes.data
  // }

  return {
    challengeRequest,
    challengeVerify,
    fetchUserProfileId,
  }
}

export default useAuthChallenge
