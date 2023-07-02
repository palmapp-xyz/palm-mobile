import { getProfileMediaImg } from 'palm-core/libs/lens'
import { ContractAddr, FbProfile, SbUserMetadata } from 'palm-core/types'
import { useEffect, useState } from 'react'

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

    const sbUserMetadata = currentUser.metaData as SbUserMetadata
    const profileImg = getProfileMediaImg(fsProfileField.picture)
    if (
      currentUser.nickname !== fsProfileField.handle ||
      currentUser.plainProfileUrl !== profileImg ||
      sbUserMetadata.handle !== fsProfileField.handle ||
      sbUserMetadata.address !== fsProfileField.address ||
      sbUserMetadata.profileId !== fsProfileField.profileId
    ) {
      const data: SbUserMetadata = {
        address: fsProfileField.address as ContractAddr,
        profileId: fsProfileField.profileId,
        handle: fsProfileField.handle,
      }
      Promise.all([
        currentUser.updateMetaData(data),
        updateCurrentUserInfo(fsProfileField.handle, profileImg),
      ]).then(([_, user]) => {
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
