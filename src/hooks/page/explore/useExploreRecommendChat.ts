import useFsChannels from 'hooks/firestore/useFsChannels'
import { FbChannel } from 'types'

export type UseExploreRecommendChatReturn = {
  fsChannelList: FbChannel[]
}

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  const { fsChannelList } = useFsChannels()

  return {
    fsChannelList: fsChannelList.filter(x => !!x.name),
  }
}

export default useExploreRecommendChat
