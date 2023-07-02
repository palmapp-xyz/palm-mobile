import useFsProfiles from 'hooks/firestore/useFsProfiles'
import { FbProfile } from 'palm-core/types'

export type UseExploreRecommendUsersReturn = {
  fsProfileList: FbProfile[]
}

const useExploreRecommendUsers = (): UseExploreRecommendUsersReturn => {
  const { fsProfileList } = useFsProfiles()

  return {
    fsProfileList,
  }
}

export default useExploreRecommendUsers
