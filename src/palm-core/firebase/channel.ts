import {
  ChannelType,
  FbChannel,
  FbListing,
  FbListingState,
} from 'palm-core/types'

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

export const onExploreChannels = (
  max: number,
  callback: QuerySnapshotCallback<FbChannel>
): QuerySnapshotReturn<FbChannel> => {
  const queryConstraints = [
    where('channelType', '==', ChannelType.GROUP),
    where('name', '!=', ''),
    limit(max),
  ]
  return onQuerySnapshot<FbChannel>(collection(firestore, 'channels') as any, {
    callback,
    queryConstraints,
  })
}

export const onChannel = (
  channelUrl: string,
  callback: DocSnapshotCallback<FbChannel>
): DocSnapshotReturn<FbChannel> => {
  const ref = doc<FbChannel>(firestore as any, 'channels', channelUrl)
  return onDocSnapshot<FbChannel>(ref as any, {
    callback,
  })
}

export const onChannelListings = (
  channelUrl: string,
  state: FbListingState,
  callback: QuerySnapshotCallback<FbListing>
): QuerySnapshotReturn<FbListing> => {
  const queryConstraints = [
    where('status', '==', state),
    where('order', '!=', null || undefined),
  ]
  return onQuerySnapshot<FbListing>(
    collection(firestore, 'channels', channelUrl, 'listings') as any,
    {
      callback,
      queryConstraints,
    }
  )
}

export const channelRef = (
  channelUrl: string
): DocumentReference<FbChannel> => {
  return doc<FbChannel>(firestore as any, 'channels', channelUrl)
}

export const channelListingRef = (
  channelUrl: string,
  nonce: string
): DocumentReference<FbListing> => {
  return doc<FbListing>(
    firestore as any,
    'channels',
    channelUrl,
    'listings',
    nonce
  )
}
