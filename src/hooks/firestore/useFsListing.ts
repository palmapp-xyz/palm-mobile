import { DocumentReference, DocumentSnapshot } from 'palm-core/firebase'
import { onListing } from 'palm-core/firebase/listing'
import { FbListing } from 'palm-core/types'
import { useEffect, useState } from 'react'

import { Maybe } from '@toruslabs/openlogin'

export type UseFsListingReturn = {
  fsListing: DocumentReference<FbListing> | undefined
  fsListingField: FbListing | undefined
}

const useFsListing = ({
  nonce,
}: {
  nonce: Maybe<string>
}): UseFsListingReturn => {
  const [fsListing, setFsListing] = useState<DocumentReference<FbListing>>()
  const [fsListingField, setFsListingField] = useState<FbListing>()
  useEffect(() => {
    if (!nonce) {
      return
    }

    const { ref, unsubscribe } = onListing(nonce, {
      onNext: function (snapshot: DocumentSnapshot<FbListing>): void {
        setFsListingField(snapshot.data() as FbListing)
      },
    })
    setFsListing(ref)
    return unsubscribe
  }, [nonce])

  return { fsListing, fsListingField }
}

export default useFsListing
