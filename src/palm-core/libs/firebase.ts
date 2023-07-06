import { getDoc, setDoc } from 'palm-core/firebase'
import { channelRef } from 'palm-core/firebase/channel'
import { listingRef } from 'palm-core/firebase/listing'
import { profileRef } from 'palm-core/firebase/profile'
import { UTIL } from 'palm-core/libs'
import { ChannelType, FbChannel, FbListing, FbProfile } from 'palm-core/types'

import { MetaData } from '@sendbird/chat'
import { GroupChannel } from '@sendbird/chat/groupChannel'

export const getChannelDoc = async ({
  channelUrl,
  channel,
}: {
  channelUrl: string
  channel: GroupChannel
}): Promise<FbChannel> => {
  let snapshot = await getDoc(channelRef(channelUrl))
  if (!snapshot.exists) {
    const metadata: MetaData = await channel.getAllMetaData()
    const fbChannelField: FbChannel = UTIL.filterUndefined<FbChannel>({
      url: channel.url,
      channelType: channel.customType as ChannelType,
      tags: metadata.tags
        ? UTIL.jsonTryParse<string[]>(metadata.tags) ?? []
        : [],
      desc: metadata.desc,
      name: channel.name,
      updatedAt: new Date().getTime(),
    })
    await setDoc(channelRef(channelUrl), fbChannelField)
    snapshot = await getDoc(channelRef(channelUrl))
  }
  return snapshot.data()!
}

export const getProfileDoc = async (
  profileId: string
): Promise<FbProfile | undefined> => {
  let snapshot = await getDoc(profileRef(profileId))
  return snapshot.data()
}

export const getListingDoc = async (
  nonce: string
): Promise<FbListing | undefined> => {
  let snapshot = await getDoc(listingRef(nonce))
  return snapshot.data()
}
