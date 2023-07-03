import { FbProfile } from 'palm-core/types'

import {
  collection,
  doc,
  DocSnapshotCallback,
  DocSnapshotReturn,
  DocumentData,
  DocumentReference,
  firestore,
  FirestoreDataConverter,
  limit,
  onDocSnapshot,
  onQuerySnapshot,
  QueryDocumentSnapshot,
  QuerySnapshotCallback,
  QuerySnapshotReturn,
  where,
} from './'

export const onExploreProfiles = (
  max: number,
  callback: QuerySnapshotCallback<FbProfile>
): QuerySnapshotReturn<FbProfile> => {
  const queryConstraints = [
    where('verified', '==', true),
    where('handle', '!=', ''), // Not-equal (!=) and not-in queries exclude documents where the given field does not exist.
    limit(max),
  ]
  return onQuerySnapshot<FbProfile>(collection(firestore, 'profiles') as any, {
    callback,
    queryConstraints,
  })
}

export const onProfile = (
  profileId: string,
  callback: DocSnapshotCallback<FbProfile>
): DocSnapshotReturn<FbProfile> => {
  return onDocSnapshot<FbProfile>(profileRef(profileId), {
    callback,
  })
}

const profileConverter: FirestoreDataConverter<FbProfile> = {
  toFirestore: profile => profile,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): FbProfile =>
    snapshot.data() as FbProfile,
}

export const profileRef = (profileId: string): DocumentReference<FbProfile> => {
  return doc(firestore, 'profiles', profileId).withConverter(profileConverter)
}
