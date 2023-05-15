import useFsChannels from 'hooks/firestore/useFsChannels'
import { FbChannel } from 'types'

export type UseExploreRecommendChatReturn = {
  fsChannelList: FbChannel[]
  isLoading: boolean
}

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  const { fsChannelList, isLoading } = useFsChannels()

  return {
    fsChannelList: fsChannelList.filter(x => !!x.name),
    isLoading,
  }
}

export default useExploreRecommendChat
