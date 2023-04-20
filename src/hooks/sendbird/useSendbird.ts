import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { v5 as uuidv5 } from 'uuid'

import {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel'
import { FileCompat } from '@sendbird/chat'
import { UTIL } from 'consts'

export type CreateGroupChatParam = {
  invitedUserIds: string[]
  coverImage?: FileCompat
  channelName: string
  operatorUserIds: string[]
}

export type CreateGroupChatIfNotExistParam = {
  channelUrl: string
  invitedUserIds: string[]
  isDistinct?: boolean
  coverImage?: string
  channelName?: string
  operatorUserIds: string[]
}

export type UseSendbirdReturn = {
  createGroupChat: (param: CreateGroupChatParam) => Promise<GroupChannel>
  createGroupChatIfNotExist: (
    param: CreateGroupChatIfNotExistParam
  ) => Promise<GroupChannel>
  generateDmChannelUrl: (a: string | undefined, b: string | undefined) => string
}

const useSendbird = (): UseSendbirdReturn => {
  const { sdk } = useSendbirdChat()

  const createGroupChat = async ({
    invitedUserIds,
    coverImage,
    channelName,
    operatorUserIds,
  }: CreateGroupChatParam): Promise<GroupChannel> => {
    const params: GroupChannelCreateParams = {
      invitedUserIds,
      name: channelName,
      coverImage,
      operatorUserIds,
    }

    return sdk.groupChannel.createChannel(UTIL.noUndefinedObj(params))
  }

  const createGroupChatIfNotExist = async ({
    channelUrl,
    invitedUserIds,
    coverImage,
    isDistinct,
    channelName,
    operatorUserIds,
  }: CreateGroupChatIfNotExistParam): Promise<GroupChannel> => {
    let channel: GroupChannel
    try {
      channel = await sdk.groupChannel.getChannel(channelUrl)
    } catch {
      const params: GroupChannelCreateParams = {
        invitedUserIds,
        name: channelName,
        coverImage,
        isDistinct,
        operatorUserIds,
      }
      channel = await sdk.groupChannel.createChannel(
        UTIL.noUndefinedObj(params)
      )
    }
    return channel
  }

  const generateDmChannelUrl = (
    a: string | undefined,
    b: string | undefined
  ): string => uuidv5([String(a), String(b)].sort().join('-'), uuidv5.DNS)

  return { createGroupChat, createGroupChatIfNotExist, generateDmChannelUrl }
}

export default useSendbird
