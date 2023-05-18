import useFsChannels from 'hooks/firestore/useFsChannels'
import { FbChannel } from 'types'

export type UseExploreRecommendChatReturn = {
  fsChannelList: FbChannel[]
}

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  const { channels } = useFsChannels()

  return {
    fsChannelList: channels.filter(x => !!x.name),
  }
}

export default useExploreRecommendChat
