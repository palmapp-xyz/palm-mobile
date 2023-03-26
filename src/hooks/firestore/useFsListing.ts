import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

import useReactQuery from 'hooks/complex/useReactQuery'
import { FbListing, FirestoreKeyEnum } from 'types'
import { useMemo } from 'react'
import { Maybe } from '@toruslabs/openlogin'

export type UseFsListingReturn = {
  fsListing?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsListingField?: FbListing
  isFetching: boolean
  refetch: () => void
}

const useFsListing = ({
  nonce,
}: {
  nonce: Maybe<string>
}): UseFsListingReturn => {
  const {
    data: fsListing,
    refetch: refetchListing,
    remove: removeListing,
    isFetching: isFetchingListing,
  } = useReactQuery(
    [FirestoreKeyEnum.Listing, nonce],
    async () => {
      if (nonce) {
        const _fsListing = firestore().collection('listings').doc(nonce)
        const listingDoc = await _fsListing.get()

        if (!listingDoc.exists) {
          return undefined
        }

        return _fsListing
      }
    },
    {
      enabled: !!nonce,
    }
  )

  const {
    data: fsListingField,
    refetch: refetchField,
    remove: removeField,
    isFetching: isFetchingField,
  } = useReactQuery(
    [FirestoreKeyEnum.ListingField, fsListing?.id],
    async () => {
      if (fsListing) {
        return (await fsListing?.get()).data() as FbListing
      }
    },
    {
      enabled: !!fsListing,
    }
  )

  const isFetching = useMemo(
    () => isFetchingListing || isFetchingField,
    [isFetchingListing, isFetchingField]
  )

  const refetch = async (): Promise<void> => {
    removeListing()
    removeField()
    refetchListing()
    refetchField()
  }

  return { fsListing, fsListingField, refetch, isFetching }
}

export default useFsListing
