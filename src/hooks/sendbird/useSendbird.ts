import { UTIL } from 'consts'
import { getFsChannel } from 'libs/firebase'
import { filterUndefined } from 'libs/utils'
import { ChannelType, FbChannel } from 'types'
import { v5 as uuidv5 } from 'uuid'

import { FileCompat, MetaData } from '@sendbird/chat'
import {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

export type CreateGroupChatParam = {
  channelUrl?: string
  channelName: string
  desc?: string
  tags?: string[]
  coverImage?: FileCompat | string
  invitedUserIds: string[]
  operatorUserIds: string[]
  isDistinct?: boolean
  channelType: ChannelType
}

export type UseSendbirdReturn = {
  createGroupChat: (param: CreateGroupChatParam) => Promise<GroupChannel>
  generateDmChannelUrl: (a: string | undefined, b: string | undefined) => string
}

const useSendbird = (): UseSendbirdReturn => {
  const { sdk } = useSendbirdChat()

  const createGroupChat = async ({
    channelUrl,
    channelName,
    desc,
    tags,
    invitedUserIds,
    coverImage,
    operatorUserIds,
    isDistinct,
    channelType,
  }: CreateGroupChatParam): Promise<GroupChannel> => {
    let channel: GroupChannel | undefined

    if (channelUrl) {
      try {
        channel = await sdk.groupChannel.getChannel(channelUrl)
      } catch {}
    }

    if (!channel) {
      const params: GroupChannelCreateParams = {
        channelUrl,
        invitedUserIds,
        name: channelName,
        coverImage: typeof coverImage === 'string' ? undefined : coverImage,
        coverUrl: typeof coverImage === 'string' ? coverImage : undefined,
        operatorUserIds,
        isDistinct: !!isDistinct,
        isPublic: !isDistinct,
        customType: channelType,
      }

      channel = await sdk.groupChannel.createChannel(
        UTIL.noUndefinedObj(params)
      )
    }

    const data: MetaData = filterUndefined<{
      [key: string]: string | undefined
    }>({
      desc,
      tags: JSON.stringify(tags),
    }) as MetaData
    if (Object.keys(data).length > 0) {
      await channel.createMetaData(data)
    }

    const fsChannel = await getFsChannel({
      channel,
      channelUrl: channel.url,
    })
    const updateParam: Partial<FbChannel> = filterUndefined<Partial<FbChannel>>(
      {
        name: channelName,
        tags,
        desc,
        coverImage: channel.coverUrl,
      }
    )
    await fsChannel.update(updateParam)

    return channel
  }

  const generateDmChannelUrl = (
    a: string | undefined,
    b: string | undefined
  ): string => uuidv5([String(a), String(b)].sort().join('-'), uuidv5.DNS)

  return { createGroupChat, generateDmChannelUrl }
}

export default useSendbird
