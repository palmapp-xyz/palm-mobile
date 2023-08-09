import { RECOMMENDED_CHANNELS_URL } from 'palm-core/consts/url'
import { onExploreChannels } from 'palm-core/firebase/channel'
import { UTIL } from 'palm-core/libs'
import fetchWithTimeout from 'palm-core/libs/fetchWithTimeout'
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

  const [recommendedChannelUrls, setRecommendedChannelUrls] = useState<
    string[] | undefined
  >(undefined)

  const fetchRecommendedChatUrls = async (): Promise<void> => {
    try {
      const ret = await fetchWithTimeout(RECOMMENDED_CHANNELS_URL, 5000)
      if (ret.ok) {
        const urls = (await ret.json()) as {
          testnet: string[]
          mainnet: string[]
        }
        setRecommendedChannelUrls(
          UTIL.isMainnet() ? urls.mainnet : urls.testnet
        )
      } else {
        setRecommendedChannelUrls([])
      }
    } catch (e) {
      setRecommendedChannelUrls([])
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRecommendedChatUrls()
    setChannels([])
  }, [])

  useEffect(() => {
    if (!recommendedChannelUrls) {
      return
    }

    setIsFetching(true)
    const { unsubscribe } = onExploreChannels({
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

          const channel = documentSnapshot.data() as FbChannel

          if (recommendedChannelUrls.length > 0) {
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
