import { FirebaseOptions, initializeApp } from 'firebase/app'
import {
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  Query,
  QueryConstraint,
  QuerySnapshot,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore'

import config from './firebase.config.json'

export const firebaseApp = initializeApp(config as FirebaseOptions)

export const firestore = getFirestore(firebaseApp)

export * from 'firebase/firestore'

export type QuerySnapshotCallback<T> = {
  next?: (snapshot: QuerySnapshot<T>) => void
  error?: (error: FirestoreError) => void
  complete?: () => void
}

export const onQuerySnapshot = <T>(
  ref: Query<T>,
  {
    callback,
    queryConstraints,
  }: {
    callback: QuerySnapshotCallback<T>
    queryConstraints?: QueryConstraint[]
  }
): QuerySnapshotReturn<T> => {
  const q: Query<T> = queryConstraints
    ? query<T>(ref, ...queryConstraints)
    : query<T>(ref)
  const unsubscribe = onSnapshot(q, { includeMetadataChanges: false }, callback)
  return { ref: q, unsubscribe }
}

export type QuerySnapshotReturn<T> = Unsubscribe & {
  ref: Query<T>
}

export type DocSnapshotCallback<T> = {
  onNext: (snapshot: DocumentSnapshot<T>) => void
  onError?: (error: FirestoreError) => void
  onCompletion?: () => void
}

export const onDocSnapshot = <T>(
  ref: DocumentReference<T>,
  {
    callback,
  }: {
    callback: DocSnapshotCallback<T>
  }
): DocSnapshotReturn<T> => {
  const unsubscribe = onSnapshot(
    ref as any,
    { includeMetadataChanges: false },
    callback.onNext,
    callback.onError,
    callback.onCompletion
  )
  return { ref, unsubscribe }
}

export type DocSnapshotReturn<T> = Unsubscribe & {
  ref: DocumentReference<T>
}

export type Unsubscribe = {
  unsubscribe: () => void
}
