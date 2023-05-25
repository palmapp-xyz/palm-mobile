import { getProfileMediaImg } from 'libs/lens'
import { useEffect, useState } from 'react'
import { FbProfile } from 'types'

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

export type UseFsProfileReturn = {
  fsProfile?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsProfileField?: FbProfile
}

const useFsProfile = ({
  profileId,
}: {
  profileId?: string
}): UseFsProfileReturn => {
  const [fsProfileField, setFsProfileField] = useState<FbProfile | undefined>()

  const { currentUser, setCurrentUser, updateCurrentUserInfo } =
    useSendbirdChat()

  const fsProfile = firestore().collection('profiles').doc(profileId)

  useEffect(() => {
    if (!profileId) {
      return
    }
    const subscriber = fsProfile.onSnapshot(profileDocSnapshot => {
      if (profileDocSnapshot.exists) {
        setFsProfileField(profileDocSnapshot.data() as FbProfile)
      }
    })
    return () => subscriber()
  }, [profileId])

  useEffect(() => {
    if (!currentUser || !fsProfileField) {
      return
    }
    const profileImg = getProfileMediaImg(fsProfileField.picture)
    if (
      currentUser.nickname !== fsProfileField.handle ||
      currentUser.plainProfileUrl !== profileImg
    ) {
      updateCurrentUserInfo(fsProfileField.handle, profileImg).then(user => {
        setCurrentUser(user)
      })
    }
  }, [fsProfileField])

  return {
    fsProfile,
    fsProfileField,
  }
}

export default useFsProfile
