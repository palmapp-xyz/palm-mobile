import { onExploreChannels } from 'palm-core/firebase/channel'
import { recordError } from 'palm-core/libs/logger'
import { FbChannel } from 'palm-core/types'
import { useEffect, useState } from 'react'

export type UseFsChannelsReturn = {
  isFetching: boolean
  channels: FbChannel[]
}

const useFsChannels = ({
  limit = 5,
  recommendedChannelUrls,
}: {
  limit?: number
  recommendedChannelUrls?: string[]
}): UseFsChannelsReturn => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [channels, setChannels] = useState<FbChannel[]>([])

  useEffect(() => {
    setChannels([])
    setIsFetching(true)
    const { unsubscribe } = onExploreChannels({
      error: e => {
        setIsFetching(false)
        recordError(e, 'onExploreChannels')
      },
      next: querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const channel = documentSnapshot.data() as FbChannel

          if (
            !documentSnapshot.exists ||
            channel.url?.includes('pushtesttool')
          ) {
            return
          }

          if (recommendedChannelUrls && recommendedChannelUrls.length > 0) {
            recommendedChannelUrls.forEach(url => {
              url === channel.url && setChannels(prev => [...prev, channel])
            })
          } else {
            channels.length < limit && setChannels(prev => [...prev, channel])
          }
        })
      },
      complete: () => {
        setIsFetching(false)
        setChannels(channels)
      },
    })
    return unsubscribe
  }, [recommendedChannelUrls])

  return {
    isFetching,
    channels,
  }
}

export default useFsChannels
