import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

import { ContractAddr, User } from 'types'
import { useEffect, useState } from 'react'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { getProfileImgFromProfile } from 'libs/lens'

export type UseFsProfileReturn = {
  fsProfile?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsProfileField?: User
}

const useFsProfile = ({
  address,
}: {
  address?: string
}): UseFsProfileReturn => {
  const [fsProfileField, setFsProfileField] = useState<User | undefined>()

  const { currentUser, setCurrentUser, updateCurrentUserInfo } =
    useSendbirdChat()

  const fsProfile = firestore().collection('profiles').doc(address)

  useEffect(() => {
    const subscriber = fsProfile.onSnapshot(profileDocSnapshot => {
      if (!profileDocSnapshot.exists) {
        const profileField: User = {
          address: address as ContractAddr,
        }
        fsProfile.set(profileField).then(() => {
          setFsProfileField(profileField)
        })
      } else {
        setFsProfileField(profileDocSnapshot.data() as User)
      }
    })
    return () => subscriber()
  }, [address])

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

  return {
    fsProfile,
    fsProfileField,
  }
}

export default useFsProfile
