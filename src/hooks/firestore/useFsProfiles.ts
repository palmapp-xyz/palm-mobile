import useReactQuery from 'hooks/complex/useReactQuery'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { FbProfile, FirestoreKeyEnum } from 'types'

import firestore from '@react-native-firebase/firestore'

export type UseFsProfilesReturn = {
  fsProfileList: FbProfile[]
}

const useFsProfiles = (): UseFsProfilesReturn => {
  const limit = 5
  const [user] = useRecoilState(appStore.user)
  const { data: fsProfileList = [] } = useReactQuery(
    [FirestoreKeyEnum.Profiles],
    async () => {
      if (!user) {
        return
      }

      const list: FbProfile[] = []
      await firestore()
        .collection('profiles')
        .limit(limit)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (!documentSnapshot.exists) {
              return
            }
            const profile: FbProfile = documentSnapshot.data() as FbProfile
            if (
              profile.verified &&
              profile.profileId !== user.auth?.profileId
            ) {
              list.push(profile)
            }
          })
        })

      return list
    },
    { enabled: !!user }
  )

  return {
    fsProfileList,
  }
}

export default useFsProfiles
