import useFsChannels from 'hooks/firestore/useFsChannels'
import { FbChannel } from 'palm-core/types'

export type UseExploreRecommendChatReturn = {
  fsChannelList: FbChannel[]
}

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  const { channels } = useFsChannels()

  return {
    fsChannelList: channels,
  }
}

export default useExploreRecommendChat
