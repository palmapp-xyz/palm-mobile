import useAuth from 'palm-react/hooks/auth/useAuth'

import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useGroupChannelList } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

export type useGroupChannelsReturn = {
  loading: boolean
  refreshing: boolean
  refresh: () => Promise<void>
  groupChannels: GroupChannel[]
  next: () => Promise<void>
}

export const useGroupChannels = (
  channelUrls: string[]
): useGroupChannelsReturn => {
  const { sdk } = useSendbirdChat()
  const { user } = useAuth()
  return useGroupChannelList(sdk, user?.auth?.profileId, {
    queryCreator: () =>
      sdk.groupChannel.createMyGroupChannelListQuery({
        channelUrlsFilter: channelUrls,
      }),
  })
}
