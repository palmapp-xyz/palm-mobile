import useFsChannels from 'hooks/firestore/useFsChannels'
import { FbChannel } from 'palm-core/types'

export type UseExploreRecommendChatReturn = {
  fsChannelList: FbChannel[]
  isFetching: boolean
}

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  const { isFetching, channels } = useFsChannels()

  return {
    fsChannelList: channels,
    isFetching,
  }
}

export default useExploreRecommendChat
