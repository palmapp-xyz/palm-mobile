import { onExploreChannels } from 'palm-core/firebase/channel'
import { recordError } from 'palm-core/libs/logger'
import { FbChannel } from 'palm-core/types'
import { useEffect, useState } from 'react'

export type UseFsChannelsReturn = {
  isFetching: boolean
  channels: FbChannel[]
}

const useFsChannels = (): UseFsChannelsReturn => {
  const limit = 5

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [channels, setChannels] = useState<FbChannel[]>([])

  useEffect(() => {
    const { unsubscribe } = onExploreChannels(limit, {
      error: e => {
        setIsFetching(false)
        recordError(e, 'onExploreChannels')
      },
      next: querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (
            !documentSnapshot.exists ||
            (documentSnapshot.data() as FbChannel).url?.includes('pushtesttool')
          ) {
            return
          }
          channels.filter((item: FbChannel) => {
            item.url !== (documentSnapshot.data() as FbChannel).url
          })

          if (channels.length < limit) {
            channels.push(documentSnapshot.data() as FbChannel)
          } else {
            channels.slice(1).push(documentSnapshot.data() as FbChannel)
          }
        })
      },
      complete: () => {
        setIsFetching(false)
        setChannels(channels)
      },
    })
    return unsubscribe
  }, [])

  return {
    isFetching,
    channels,
  }
}

export default useFsChannels
