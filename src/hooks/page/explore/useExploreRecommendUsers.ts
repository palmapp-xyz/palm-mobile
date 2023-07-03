import useFsProfiles from 'hooks/firestore/useFsProfiles'
import { FbProfile } from 'palm-core/types'

export type UseExploreRecommendUsersReturn = {
  fsProfileList: FbProfile[]
  isFetching: boolean
}

const useExploreRecommendUsers = (): UseExploreRecommendUsersReturn => {
  const { isFetching, fsProfileList } = useFsProfiles()

  return {
    fsProfileList,
    isFetching,
  }
}

export default useExploreRecommendUsers
