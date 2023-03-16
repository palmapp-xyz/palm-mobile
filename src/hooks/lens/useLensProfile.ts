import { useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { Profile } from '@lens-protocol/react-native-lens-ui-kit/dist/graphql/generated'

import { PaginatedProfileResult } from 'graphqls/__generated__/graphql'
import { ContractAddr, QueryKeyEnum } from 'types'
import useLens from './useLens'

export type UseLensProfileReturn = {
  profile?: Profile
  refetch: () => Promise<void>
  useProfilesReturn: UseQueryResult<PaginatedProfileResult | undefined, unknown>
  useDefaultProfileReturn: UseQueryResult<Profile | undefined, unknown>
}

const useLensProfile = ({
  userAddress,
}: {
  userAddress?: ContractAddr
}): UseLensProfileReturn => {
  const { getProfiles, getDefaultProfile } = useLens()

  const useProfilesReturn = useQuery(
    [QueryKeyEnum.LENS_PROFILES, userAddress],
    async () => {
      if (userAddress) {
        return getProfiles({ ownedBy: [userAddress] })
      }
    },
    { enabled: !!userAddress }
  )

  const useDefaultProfileReturn = useQuery(
    [QueryKeyEnum.LENS_DEFAULT_PROFILE, userAddress],
    async () => {
      if (userAddress) {
        return getDefaultProfile(userAddress)
      }
    },
    { enabled: !!userAddress }
  )

  const refetch = async (): Promise<void> => {
    useProfilesReturn.remove()
    useProfilesReturn.refetch()
    useDefaultProfileReturn.remove()
    useDefaultProfileReturn.refetch()
  }

  const profile = useMemo(() => {
    return useDefaultProfileReturn.data || useProfilesReturn.data?.items?.[0]
  }, [useDefaultProfileReturn.data, useProfilesReturn.data?.items])

  return {
    profile,
    refetch,
    useProfilesReturn,
    useDefaultProfileReturn,
  }
}

export default useLensProfile