import { RECOMMENDED_USERS_URL } from 'palm-core/consts/url'
import { UTIL } from 'palm-core/libs'
import fetchWithTimeout from 'palm-core/libs/fetchWithTimeout'
import { FbProfile } from 'palm-core/types'
import useFsProfiles from 'palm-react/hooks/firestore/useFsProfiles'
import appStore from 'palm-react/store/appStore'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

export type UseExploreRecommendUsersReturn = {
  fsProfileList: FbProfile[]
  isFetching: boolean
}

const useExploreRecommendUsers = (): UseExploreRecommendUsersReturn => {
  const [user] = useRecoilState(appStore.user)
  const [recommendedUsers, setRecommendedUsers] = useState<
    string[] | undefined
  >(undefined)

  const { isFetching, fsProfileList } = useFsProfiles({ recommendedUsers })

  const fetchRecommendedChatUrls = async (): Promise<void> => {
    try {
      const ret = await fetchWithTimeout(RECOMMENDED_USERS_URL, 5000)
      if (ret.ok) {
        const urls = (await ret.json()) as {
          testnet: string[]
          mainnet: string[]
        }
        const list = UTIL.isMainnet() ? urls.mainnet : urls.testnet
        setRecommendedUsers(
          list.filter((s: string) => s !== user?.auth?.profileId)
        )
      } else {
        setRecommendedUsers([])
      }
    } catch (e) {
      setRecommendedUsers([])
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRecommendedChatUrls()
  }, [])

  return {
    fsProfileList,
    isFetching,
  }
}

export default useExploreRecommendUsers
