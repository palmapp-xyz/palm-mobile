import { useSendbirdChat } from '@sendbird/uikit-react-native'
import {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel'

export type UseSendbirdReturn = {
  createGroupChatIfNotExist: (
    channelUrl: string,
    operatorUserIds?: string[],
    onChannelCreated?: ((channel: GroupChannel) => void) | undefined,
    onError?: ((e: unknown) => void) | undefined
  ) => Promise<void>
}

const useSendbird = (): UseSendbirdReturn => {
  const { sdk } = useSendbirdChat()

  const createGroupChatIfNotExist = async (
    channelUrl: string,
    operatorUserIds?: string[],
    onChannelCreated?: (channel: GroupChannel) => void,
    onError?: (e: unknown) => void
  ): Promise<void> => {
    let channel
    try {
      channel = await sdk.groupChannel.getChannel(channelUrl)
    } catch (e) {
      console.error('getChannel Error: ', e)
      const params: GroupChannelCreateParams = {
        channelUrl,
        invitedUserIds: [channelUrl],
        name: '',
        coverUrl: '',
        isDistinct: false,
      }
      params.operatorUserIds = operatorUserIds
      channel = await sdk.groupChannel.createChannel(params)
    }

    if (channel) {
      onChannelCreated?.(channel)
    } else {
      onError?.(`Failed to create the sendbird channel for ${channelUrl}`)
    }
  }

  return { createGroupChatIfNotExist }
}

export default useSendbird
