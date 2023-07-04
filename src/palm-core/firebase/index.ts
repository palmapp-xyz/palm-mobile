import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreDataConverter,
  FirestoreError,
  getFirestore,
  onSnapshot,
  PartialWithFieldValue,
  Query,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore'

import config from './firebase.config.json'

export const firebaseApp = initializeApp(config as FirebaseOptions)

export const firestore = getFirestore(firebaseApp)
export const appAuth = getAuth(firebaseApp)

export * from 'firebase/auth'
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
  next?: (snapshot: DocumentSnapshot<T>) => void
  error?: (error: FirestoreError) => void
  complete?: () => void
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
    ref,
    { includeMetadataChanges: false },
    callback
  )
  return { ref, unsubscribe }
}

export type DocSnapshotReturn<T> = Unsubscribe & {
  ref: DocumentReference<T>
}

export type Unsubscribe = {
  unsubscribe: () => void
}

export const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: PartialWithFieldValue<T>): DocumentData =>
    data as DocumentData,
  fromFirestore: (snap: QueryDocumentSnapshot): T => snap.data() as T,
})
