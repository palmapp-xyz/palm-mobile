import { recordError } from 'libs/logger'
import { useEffect, useState } from 'react'
import { ChannelType, FbChannel } from 'types'

import firestore from '@react-native-firebase/firestore'

export type UseFsChannelsReturn = {
  channels: FbChannel[]
}

const useFsChannels = (): UseFsChannelsReturn => {
  const limit = 5

  const [channels, setChannels] = useState<FbChannel[]>([])

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('channels')
      .where('channelType', '!=', ChannelType.DIRECT)
      .limit(limit)
      .onSnapshot({
        error: e => {
          recordError(e, 'useFsChannels:onSnapshot')
        },
        next: querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (!documentSnapshot.exists) {
              return
            }
            channels.filter((item: FbChannel) => {
              item.url !== (documentSnapshot.data() as FbChannel).url
            })

            if (channels.length < 5) {
              channels.push(documentSnapshot.data() as FbChannel)
            } else {
              channels.slice(1).push(documentSnapshot.data() as FbChannel)
            }
            setChannels(channels)
          })
        },
      })
    return unsubscribe
  }, [])

  return {
    channels,
  }
}

export default useFsChannels
