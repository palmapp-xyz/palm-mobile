import { FbChannel } from 'palm-core/types'
import useFsChannels from 'palm-react/hooks/firestore/useFsChannels'

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
