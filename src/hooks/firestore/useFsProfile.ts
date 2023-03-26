import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

import useReactQuery from 'hooks/complex/useReactQuery'
import { ContractAddr, FirestoreKeyEnum, User } from 'types'
import { useMemo } from 'react'

export type UseFsProfileReturn = {
  fsProfile?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsProfileField?: User
  isFetching: boolean
  refetch: () => void
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

  return { fsProfile, fsProfileField, refetch, isFetching }
}

export default useFsProfile
