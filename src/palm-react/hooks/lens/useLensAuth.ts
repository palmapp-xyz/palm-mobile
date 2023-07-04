import {
  AuthenticateDocument,
  AuthenticationResult,
  ChallengeDocument,
  RefreshDocument,
  VerifyDocument,
} from 'palm-core/graphqls/__generated__/graphql'
import { UTIL } from 'palm-core/libs'
import { recordError } from 'palm-core/libs/logger'
import { SupportedNetworkEnum, TrueOrErrReturn } from 'palm-core/types'
import useWeb3 from 'palm-react/hooks/complex/useWeb3'

import {
  ApolloQueryResult,
  FetchResult,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  useApolloClient,
} from '@apollo/client'

export type UseLensAuthReturn = {
  authenticate: () => Promise<TrueOrErrReturn<AuthenticationResult | null>>
  refreshAuthIfExpired: (
    authResult: AuthenticationResult,
    serverVerify?: boolean
  ) => Promise<TrueOrErrReturn<AuthenticationResult | undefined>>
  refreshAuth: (
    authResult: AuthenticationResult
  ) => Promise<TrueOrErrReturn<AuthenticationResult>>
  verifyAuth: (
    authResult: AuthenticationResult
  ) => Promise<TrueOrErrReturn<boolean>>
}

const useLensAuth = (): UseLensAuthReturn => {
  const { getSigner } = useWeb3(SupportedNetworkEnum.ETHEREUM)
  const { query: aQuery, mutate: aMutate } = useApolloClient()

  const query = <
    T = any,
    TVariables extends OperationVariables = OperationVariables
  >(
    authToken: string,
    options: QueryOptions<TVariables, T>
  ): Promise<ApolloQueryResult<T>> =>
    aQuery({
      context: {
        headers: {
          'x-access-token': authToken ? `Bearer ${authToken}` : '',
        },
      },
      ...options,
    })

  const mutate = <
    TData = any,
    TVariables extends OperationVariables = OperationVariables
  >(
    authToken: string,
    options: MutationOptions<TData, TVariables>
  ): Promise<FetchResult<TData>> =>
    aMutate({
      context: {
        headers: {
          'x-access-token': authToken ? `Bearer ${authToken}` : '',
        },
      },
      ...options,
    })

  const authenticate = async (): Promise<
    TrueOrErrReturn<AuthenticationResult | null>
  > => {
    const signer = await getSigner()
    if (signer) {
      try {
        /* first request the challenge from the API server */
        const challengeInfo = await aQuery({
          query: ChallengeDocument,
          variables: {
            request: { address: signer.address },
          },
        })

        /* ask the user to sign a message with the challenge info returned from the server */
        const signature = signer.sign(
          challengeInfo.data.challenge.text
        ).signature

        /* authenticate the user */
        const authData = await aMutate({
          mutation: AuthenticateDocument,
          variables: {
            request: {
              address: signer.address,
              signature,
            },
          },
        })

        /* if user authentication is successful, you will receive an accessToken and refreshToken */
        if (
          authData.data?.authenticate?.accessToken &&
          authData.data?.authenticate?.refreshToken
        ) {
          return {
            success: true,
            value: authData.data.authenticate,
          }
        } else {
          return {
            success: true,
            value: null,
          }
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  // returns new auth token if expired, undefined if not expired
  const refreshAuthIfExpired = async (
    authResult: AuthenticationResult,
    serverVerify?: boolean
  ): Promise<TrueOrErrReturn<AuthenticationResult | undefined>> => {
    try {
      if (serverVerify) {
        await verifyAuth(authResult).then(res => {
          if (!res.success) {
            throw new Error(res.errMsg)
          }
        })
      }

      if (!authResult.accessToken || !authResult.refreshToken) {
        throw new Error(
          `useLens:refreshIfExpired invalid Lens auth token ${JSON.stringify(
            authResult
          )}`
        )
      }

      const currTimeInMillisecs = new Date().getTime() / 1000
      const parsed = UTIL.parseJwt(authResult.accessToken)
      if (!parsed || parsed.iat > currTimeInMillisecs) {
        throw new Error(
          `useLens:refreshIfExpired invalid jwt parsed ${JSON.stringify(
            parsed
          )}`
        )
      }

      if (parsed.exp > currTimeInMillisecs + 60 * 1000) {
        /* 60 seconds buffer */
        return { success: true, value: undefined }
      }
      const res = await refreshAuth(authResult)
      if (!res.success) {
        throw new Error(`useLens:refreshIfExpired failed ${res.errMsg}`)
      }
      return { success: true, value: res.value }
    } catch (e) {
      recordError(e, 'useLens:refreshIfExpired error')
      return { success: false, errMsg: JSON.stringify(e) }
    }
  }

  const refreshAuth = async (
    authResult: AuthenticationResult
  ): Promise<TrueOrErrReturn<AuthenticationResult>> => {
    const signer = await getSigner()
    if (signer) {
      try {
        const authData = await mutate(authResult.accessToken, {
          mutation: RefreshDocument,
          variables: {
            request: {
              refreshToken: authResult.refreshToken,
            },
          },
        })

        return {
          success: true,
          value: authData.data!.refresh!,
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  const verifyAuth = async (
    authResult: AuthenticationResult
  ): Promise<TrueOrErrReturn<boolean>> => {
    const signer = await getSigner()
    if (signer) {
      try {
        const authData = await query(authResult.accessToken, {
          query: VerifyDocument,
          variables: {
            request: { accessToken: authResult.accessToken },
          },
        })

        return {
          success: true,
          value: authData.data!.verify!,
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  return {
    authenticate,
    refreshAuthIfExpired,
    refreshAuth,
    verifyAuth,
  }
}

export default useLensAuth
