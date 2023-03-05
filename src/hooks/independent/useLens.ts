import { Account } from 'web3-core'
import _ from 'lodash'
import { useApolloClient } from '@apollo/client'

import useWeb3 from 'hooks/complex/useWeb3'
import { lens, lensResponse } from 'libs/lens'
import { QueryKeyEnum, TrueOrErrReturn } from 'types'
import useReactQuery from 'hooks/complex/useReactQuery'

export type UseLensReturn = {
  signer?: Account
  sign: () => Promise<TrueOrErrReturn>
  defaultProfile?: lensResponse.DefaultProfile
  getProfile: (profileId: string) => Promise<lensResponse.Profile>
  getDefaultProfile: () => Promise<lensResponse.DefaultProfile | undefined>
}

const useLens = (): UseLensReturn => {
  const { signer } = useWeb3()
  const { query, mutate } = useApolloClient()
  const { data: defaultProfile } = useReactQuery(
    [QueryKeyEnum.LENS_DEFAULT_PROFILE, signer?.address],
    async () => {
      return getDefaultProfile()
    }
  )
  const sign = async (): Promise<TrueOrErrReturn> => {
    if (signer) {
      try {
        /* first request the challenge from the API server */
        const challengeInfo = await query({
          query: lens.challenge,
          variables: { address: signer.address },
        })

        /* ask the user to sign a message with the challenge info returned from the server */
        const signature = signer.sign(
          challengeInfo.data.challenge.text
        ).signature

        /* authenticate the user */
        const authData = await mutate<{
          authenticate: { accessToken: string }
        }>({
          mutation: lens.authenticate,
          variables: {
            address: signer.address,
            signature,
          },
        })

        /* if user authentication is successful, you will receive an accessToken and refreshToken */
        if (authData.data?.authenticate.accessToken) {
          return {
            success: true,
            value: authData.data.authenticate.accessToken,
          }
        }
      } catch (error) {
        return { success: false, errMsg: _.toString(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  const getProfile = async (
    profileId: string
  ): Promise<lensResponse.Profile> => {
    const profile = await query<lensResponse.Profile>({
      query: lens.profile,
      variables: { profileId },
    })
    return profile.data
  }

  const getDefaultProfile = async (): Promise<
    lensResponse.DefaultProfile | undefined
  > => {
    if (signer) {
      const profile = await query<lensResponse.DefaultProfile>({
        query: lens.defaultProfile,
        variables: { address: signer.address },
      })
      return profile.data
    }
  }

  return { signer, sign, defaultProfile, getProfile, getDefaultProfile }
}

export default useLens
