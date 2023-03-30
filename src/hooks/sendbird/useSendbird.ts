import { useSendbirdChat } from '@sendbird/uikit-react-native'
import {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel'

export type CreateGroupChatInput = {
  channelUrl: string
  invitedUserIds: string[]
  channelName?: string
  operatorUserIds?: string[]
  onChannelCreated?: ((channel: GroupChannel) => void) | undefined
  onError?: ((e: unknown) => void) | undefined
}

export type UseSendbirdReturn = {
  createGroupChatIfNotExist: ({
    channelUrl,
    invitedUserIds,
    channelName,
    operatorUserIds,
    onChannelCreated,
    onError,
  }: CreateGroupChatInput) => Promise<void>
  generateDmChannelUrl: (a: string | undefined, b: string | undefined) => string
}

const useSendbird = (): UseSendbirdReturn => {
  const { sdk } = useSendbirdChat()

  const createGroupChatIfNotExist = async ({
    channelUrl,
    invitedUserIds,
    channelName,
    operatorUserIds,
    onChannelCreated,
    onError,
  }: CreateGroupChatInput): Promise<void> => {
    let channel
    try {
      channel = await sdk.groupChannel.getChannel(channelUrl)
    } catch (e) {
      console.error('getChannel Error: ', e)
      const params: GroupChannelCreateParams = {
        channelUrl,
        invitedUserIds: invitedUserIds,
        name: channelName,
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

  const generateDmChannelUrl = (
    a: string | undefined,
    b: string | undefined
  ): string => [String(a), String(b)].sort().join('-')

  return { createGroupChatIfNotExist, generateDmChannelUrl }
}

export default useSendbird
