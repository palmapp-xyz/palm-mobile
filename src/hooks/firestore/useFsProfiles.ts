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

const useFsProfiles = (): UseFsProfilesReturn => {
  const [user] = useRecoilState(appStore.user)
  const limit = 10
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fsProfileList, setFsProfileList] = useState<FbProfile[]>([])

  useEffect(() => {
    if (!user?.auth?.profileId) {
      return
    }

    const { unsubscribe } = onExploreProfiles(10, {
      error: e => {
        setIsFetching(false)
        recordError(e, 'onExploreProfiles')
      },
      next: querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (
            !documentSnapshot.exists ||
            documentSnapshot.data().profileId === user.auth?.profileId
          ) {
            return
          }
          fsProfileList.filter((item: FbProfile) => {
            item.profileId !== documentSnapshot.data().profileId
          })

          if (fsProfileList.length < limit) {
            fsProfileList.push(documentSnapshot.data())
          } else {
            fsProfileList.slice(1).push(documentSnapshot.data())
          }
        })
      },
      complete: () => {
        setIsFetching(false)
        setFsProfileList(fsProfileList)
      },
    })
    return unsubscribe
  }, [])

  return {
    isFetching,
    fsProfileList,
  }
}

export default useFsProfiles
