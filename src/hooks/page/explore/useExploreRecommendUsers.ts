import { FbProfile } from 'core/types'
import useFsProfiles from 'hooks/firestore/useFsProfiles'

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
