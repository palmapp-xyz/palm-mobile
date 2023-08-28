import { RECOMMENDED_CHANNELS_URL } from 'palm-core/consts/url'
import { UTIL } from 'palm-core/libs'
import fetchWithTimeout from 'palm-core/libs/fetchWithTimeout'
import { FbChannel } from 'palm-core/types'
import useFsChannels from 'palm-react/hooks/firestore/useFsChannels'
import { useEffect, useState } from 'react'

export type UseExploreRecommendChatReturn = {
  fsChannelList: FbChannel[]
  isFetching: boolean
}

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  const [recommendedChannelUrls, setRecommendedChannelUrls] = useState<
    string[] | undefined
  >(undefined)

  const { isFetching, channels } = useFsChannels({
    recommendedChannelUrls,
  })

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
  }, [])

  return {
    fsChannelList: channels,
    isFetching,
  }
}

export default useExploreRecommendChat
