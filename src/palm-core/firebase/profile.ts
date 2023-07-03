import { FbProfile } from 'palm-core/types'

import {
  collection,
  doc,
  DocSnapshotCallback,
  DocSnapshotReturn,
  DocumentReference,
  firestore,
  limit,
  onDocSnapshot,
  onQuerySnapshot,
  QuerySnapshotCallback,
  QuerySnapshotReturn,
  where,
} from './'

export const onExploreProfiles = (
  filterIds: string[],
  max: number,
  callback: QuerySnapshotCallback<FbProfile>
): QuerySnapshotReturn<FbProfile> => {
  const queryConstraints = [
    where('verified', '==', true),
    where('profileId', 'not-in', filterIds),
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
  const ref = doc<FbProfile>(firestore as any, 'profiles', profileId)
  return onDocSnapshot<FbProfile>(ref as any, {
    callback,
  })
}

export const profileRef = (profileId: string): DocumentReference<FbProfile> => {
  return doc<FbProfile>(firestore as any, 'profiles', profileId)
}
