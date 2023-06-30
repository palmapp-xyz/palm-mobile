import { FbChannel } from 'core/types'
import useFsChannels from 'hooks/firestore/useFsChannels'

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
