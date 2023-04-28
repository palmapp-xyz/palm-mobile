import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import _ from 'lodash'

import { FbChannelField } from 'types'

export const formatValues = <T>(object: T): T => {
  if (!object) {
    return object
  }
  return _.omit(
    object,
    _.filter(_.keys(object), function (key) {
      return _.isUndefined(object[key])
    })
  ) as T
}

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
    const fbChannelField: FbChannelField = {
      url: channel.url,
      channelType: channel.channelType,
      tags: [],
      desc: '',
    }
    await fsChannel.set(fbChannelField)
  }

  return fsChannel
}
