import axios, { AxiosResponse } from 'axios'
import { apiPath } from 'palm-core/consts'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'

import {
  ApiEnum,
  ApiResponse,
  AuthChallengeInfo,
  AuthChallengeResult,
  ContractAddr,
} from '../types'

export const fetchUserProfileId = async (
  userAddress: ContractAddr | undefined,
  connectedNetworkId?: number
): Promise<string | undefined> => {
  if (!userAddress) {
    return undefined
  }
  const result = await challengeRequest(userAddress, connectedNetworkId)
  return result.profileId
}

export const challengeRequest = async (
  address: ContractAddr,
  connectedNetworkId?: number
): Promise<AuthChallengeInfo> => {
  const apiUrl = `${apiPath}${apiV1Fabricator[
    ApiEnum.AUTH_CHALLENGE_REQUEST
  ].post()}`

  const params = {
    address,
    chainId: connectedNetworkId ?? 1 /* ethereum */,
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

export const challengeVerify = async (
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
