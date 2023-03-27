import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

import useReactQuery from 'hooks/complex/useReactQuery'
import { ContractAddr, FirestoreKeyEnum, User } from 'types'
import { useMemo } from 'react'
import { Profile } from 'graphqls/__generated__/graphql'

export type UseFsProfileReturn = {
  fsProfile?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsProfileField?: User
  isFetching: boolean
  refetch: () => Promise<void>
  createFsProfile: (address: string, lensProfile?: Profile) => Promise<User>
}

const useFsProfile = ({
  address,
}: {
  address?: string
}): UseFsProfileReturn => {
  const {
    data: fsProfile,
    refetch: refetchProfile,
    remove: removeProfile,
    isFetching: isFetchingProfile,
  } = useReactQuery(
    [FirestoreKeyEnum.Profile, address],
    async () => {
      if (address) {
        const _fsProfile = firestore().collection('profiles').doc(address)
        const profileDoc = await _fsProfile.get()

        if (!profileDoc.exists) {
          const fbProfileField: User = {
            address: address as ContractAddr,
          }
          await _fsProfile.set(fbProfileField)
        }

        return _fsProfile
      }
    },
    {
      enabled: !!address,
    }
  )

  const {
    data: fsProfileField,
    refetch: refetchField,
    remove: removeField,
    isFetching: isFetchingField,
  } = useReactQuery(
    [FirestoreKeyEnum.ProfileField, fsProfile?.id],
    async () => {
      if (fsProfile) {
        return (await fsProfile?.get()).data() as User
      }
    },
    {
      enabled: !!fsProfile,
    }
  )

  const isFetching = useMemo(
    () => isFetchingProfile || isFetchingField,
    [isFetchingProfile, isFetchingField]
  )

  const refetch = async (): Promise<void> => {
    removeProfile()
    removeField()
    refetchProfile()
    refetchField()
  }

  const createFsProfile = async (
    userAddress: string,
    lensProfile?: Profile
  ): Promise<User> => {
    const profile = firestore().collection('profiles').doc(userAddress)
    const profileDoc = await profile.get()

    let fsUser: User = {
      address: userAddress as ContractAddr,
      lensProfile,
      ...lensProfile,
    }
    if (!profileDoc.exists) {
      await firestore().collection('profiles').doc(userAddress).set(fsUser)
    } else {
      fsUser = (await profileDoc.data()) as User
    }
    return fsUser
  }

  return {
    fsProfile,
    fsProfileField,
    createFsProfile,
    refetch,
    isFetching,
  }
}

export default useFsProfile
