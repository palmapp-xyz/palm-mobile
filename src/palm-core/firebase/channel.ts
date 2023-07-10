import {
  ChannelType,
  FbChannel,
  FbListing,
  FbListingState,
} from 'palm-core/types'

import {
  collection,
  converter,
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
  return onDocSnapshot<FbChannel>(channelRef(channelUrl), {
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
    where('order', '!=', null),
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
  return doc(firestore as any, 'channels', channelUrl).withConverter(
    converter<FbChannel>()
  )
}

export const channelListingRef = (
  channelUrl: string,
  nonce: string
): DocumentReference<FbListing> => {
  return doc<FbListing>(
    collection(firestore, 'channels', channelUrl, 'listings') as any,
    nonce
  )
}
