import { UTIL } from 'core/consts'
import { ChannelType, FbChannel, FbListing, FbProfile } from 'types'

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { MetaData } from '@sendbird/chat'
import { GroupChannel } from '@sendbird/chat/groupChannel'

import { filterUndefined } from './utils'

export const getFsChannel = async ({
  channelUrl,
  channel,
}: {
  channelUrl: string
  channel: GroupChannel
}): Promise<
  FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
> => {
  const fsChannel = firestore().collection('channels').doc(channelUrl)
  const channelDoc = await fsChannel.get()

  if (!channelDoc.exists) {
    const metadata: MetaData = await channel.getAllMetaData()
    const fbChannelField: FbChannel = filterUndefined<FbChannel>({
      url: channel.url,
      channelType: channel.customType as ChannelType,
      tags: metadata.tags
        ? UTIL.jsonTryParse<string[]>(metadata.tags) ?? []
        : [],
      desc: metadata.desc,
      name: channel.name,
      updatedAt: new Date().getTime(),
    })
    await fsChannel.set(fbChannelField)
  }

  return fsChannel
}

export const getFsProfile = async (
  profileId: string
): Promise<FbProfile | undefined> => {
  const fsProfile = await firestore()
    .collection('profiles')
    .doc(profileId)
    .get()
  if (!fsProfile.exists) {
    return undefined
  }
  return fsProfile.data() as FbProfile
}

export const getFsListing = async (
  nonce: string
): Promise<FbListing | undefined> => {
  const fsListing = await firestore().collection('listings').doc(nonce).get()
  if (!fsListing.exists) {
    return undefined
  }
  return fsListing.data() as FbListing
}
