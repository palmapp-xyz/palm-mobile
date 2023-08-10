import { onExploreProfiles } from 'palm-core/firebase/profile'
import { recordError } from 'palm-core/libs/logger'
import { FbProfile } from 'palm-core/types'
import appStore from 'palm-react/store/appStore'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

export type UseFsProfilesReturn = {
  isFetching: boolean
  fsProfileList: FbProfile[]
}

const useFsProfiles = ({
  recommendedUsers,
}: {
  recommendedUsers?: string[]
}): UseFsProfilesReturn => {
  const [user] = useRecoilState(appStore.user)
  const limit = 100
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fsProfileList, setFsProfileList] = useState<FbProfile[]>([])

  useEffect(() => {
    if (!user?.auth?.profileId) {
      return
    }
    setFsProfileList([])

    let count = 0
    const { unsubscribe } = onExploreProfiles(limit, {
      error: e => {
        setIsFetching(false)
        recordError(e, 'onExploreProfiles')
      },
      next: querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const documentUser = documentSnapshot.data()
          if (
            !documentSnapshot.exists ||
            documentUser.profileId === user.auth?.profileId
          ) {
            return
          }

          if (
            recommendedUsers &&
            recommendedUsers.length > 0 &&
            recommendedUsers.length > count
          ) {
            recommendedUsers.forEach(userProfileId => {
              if (userProfileId === documentUser.profileId) {
                setFsProfileList(prev => [...prev, documentUser])
                count++
              }
            })
          } else if (count < 10) {
            setFsProfileList(prev => [...prev, documentUser])
            count++
          }
        })
      },
      complete: () => {
        setIsFetching(false)
        setFsProfileList(fsProfileList)
      },
    })
    return unsubscribe
  }, [recommendedUsers])

  return {
    isFetching,
    fsProfileList,
  }
}

export default useFsProfiles
