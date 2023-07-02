import useReactQuery from 'hooks/complex/useReactQuery'
import { FbProfile, FirestoreKeyEnum } from 'palm-core/types'
import appStore from 'palm-react/store/appStore'
import { useRecoilState } from 'recoil'

import firestore from '@react-native-firebase/firestore'

export type UseFsProfilesReturn = {
  fsProfileList: FbProfile[]
}

const useFsProfiles = (): UseFsProfilesReturn => {
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
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (!documentSnapshot.exists) {
              return
            }
            const profile: FbProfile = documentSnapshot.data() as FbProfile
            if (
              profile.verified &&
              profile.profileId !== user.auth?.profileId &&
              !!profile.handle
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
