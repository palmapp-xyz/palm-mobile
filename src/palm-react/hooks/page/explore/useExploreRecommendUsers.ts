import { FbProfile } from 'palm-core/types'
import useFsProfiles from 'palm-react/hooks/firestore/useFsProfiles'

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
