import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

import { User } from 'types'
import { useEffect, useState } from 'react'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { getProfileImgFromProfile } from 'libs/lens'

export type UseFsProfileReturn = {
  fsProfile?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsProfileField?: User
  fetchProfile: (profileId: string) => Promise<User | undefined>
}

const useFsProfile = ({
  profileId,
}: {
  profileId?: string
}): UseFsProfileReturn => {
  const [fsProfileField, setFsProfileField] = useState<User | undefined>()

  const { currentUser, setCurrentUser, updateCurrentUserInfo } =
    useSendbirdChat()

  const fsProfile = firestore().collection('profiles').doc(profileId)

  useEffect(() => {
    if (!profileId) {
      return
    }
    const subscriber = fsProfile.onSnapshot(profileDocSnapshot => {
      if (profileDocSnapshot.exists) {
        setFsProfileField(profileDocSnapshot.data() as User)
      }
    })
    return () => subscriber()
  }, [profileId])

  useEffect(() => {
    if (!currentUser || !fsProfileField) {
      return
    }
    const profileImg = getProfileImgFromProfile(fsProfileField)
    if (
      currentUser.nickname !== fsProfileField.handle ||
      currentUser.profileUrl !== profileImg
    ) {
      updateCurrentUserInfo(fsProfileField.handle, profileImg).then(user => {
        setCurrentUser(user)
      })
    }
  }, [fsProfileField])

  const fetchProfile = async (
    _profileId: string
  ): Promise<User | undefined> => {
    const _fsProfile = await firestore()
      .collection('profiles')
      .doc(_profileId)
      .get()
    if (!_fsProfile.exists) {
      return undefined
    }
    return _fsProfile.data() as User
  }

  return {
    fsProfile,
    fsProfileField,
    fetchProfile,
  }
}

export default useFsProfile
