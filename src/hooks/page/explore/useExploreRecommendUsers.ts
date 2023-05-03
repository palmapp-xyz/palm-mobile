import useFsProfiles from 'hooks/firestore/useFsProfiles'
import { FbProfile } from 'types'

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
