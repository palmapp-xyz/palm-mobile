import { DocumentReference, DocumentSnapshot } from 'palm-core/firebase'
import { onProfile } from 'palm-core/firebase/profile'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { ContractAddr, FbProfile, SbUserMetadata } from 'palm-core/types'
import { useEffect, useState } from 'react'

import { useSendbirdChat } from '@sendbird/uikit-react-native'

export type UseFsProfileReturn = {
  fsProfile: DocumentReference<FbProfile> | undefined
  fsProfileField: FbProfile | undefined
}

const useFsProfile = ({
  profileId,
}: {
  profileId: string
}): UseFsProfileReturn => {
  const { currentUser, setCurrentUser, updateCurrentUserInfo } =
    useSendbirdChat()

  const [fsProfile, setFsProfile] = useState<DocumentReference<FbProfile>>()
  const [fsProfileField, setFsProfileField] = useState<FbProfile>()

  useEffect(() => {
    if (!profileId) {
      return
    }
    const { ref, unsubscribe } = onProfile(profileId, {
      next: (snapshot: DocumentSnapshot<FbProfile>): void => {
        setFsProfileField(snapshot.data() as FbProfile)
      },
    })
    setFsProfile(ref)
    return unsubscribe
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
