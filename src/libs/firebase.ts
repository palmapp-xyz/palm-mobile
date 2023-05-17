import { UTIL } from 'consts'
import { FbChannel } from 'types'

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
      channelType: channel.channelType,
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
