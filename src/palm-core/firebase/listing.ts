import { recordError } from 'palm-core/libs/logger'
import { ContractAddr, FbListing } from 'palm-core/types'

import {
  collection,
  doc,
  DocSnapshotCallback,
  DocSnapshotReturn,
  DocumentData,
  DocumentReference,
  firestore,
  FirestoreDataConverter,
  getDocs,
  onDocSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
} from './'

export const getActiveListings = async (
  nftContract: ContractAddr,
  tokenId: string
): Promise<FbListing[]> => {
  const activeListings: FbListing[] = []
  try {
    const q = query(
      collection(firestore, 'listings'),
      where('nftContract', '==', nftContract),
      where('tokenId', '==', tokenId)
    )
    await getDocs(q).then(ordersSnapshot => {
      ordersSnapshot.forEach(orderSnapshot => {
        const listing = orderSnapshot.data() as FbListing
        if (
          listing.order &&
          listing.status === 'active' &&
          listing.channelUrl
        ) {
          activeListings.push(listing)
        }
      })
    })
  } catch (e) {
    recordError(e, 'getActingListings')
  }
  return activeListings
}

export const onListing = (
  nonce: string,
  callback: DocSnapshotCallback<FbListing>
): DocSnapshotReturn<FbListing> => {
  return onDocSnapshot<FbListing>(listingRef(nonce), {
    callback,
  })
}

const listingConverter: FirestoreDataConverter<FbListing> = {
  toFirestore: profile => profile,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): FbListing =>
    snapshot.data() as FbListing,
}

export const listingRef = (nonce: string): DocumentReference<FbListing> => {
  return doc(firestore as any, 'listings', nonce).withConverter(
    listingConverter
  )
}
