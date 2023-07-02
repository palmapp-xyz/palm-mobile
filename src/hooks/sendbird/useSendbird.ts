import _ from 'lodash'
import { UTIL } from 'palm-core/libs'
import { getFsChannel } from 'palm-core/libs/firebase'
import { ChannelType, FbChannel } from 'palm-core/types'
import { v5 as uuidv5 } from 'uuid'

import { FileCompat, MetaData } from '@sendbird/chat'
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelListQuery,
  GroupChannelListQueryParams,
  QueryType,
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
  channelType: ChannelType
}

export type UseSendbirdReturn = {
  getDistinctChatWithUser: ({
    userProfileId,
  }: {
    userProfileId: string
  }) => Promise<GroupChannel | undefined>
  createGroupChat: (param: CreateGroupChatParam) => Promise<GroupChannel>
  generateDmChannelUrl: (a: string | undefined, b: string | undefined) => string
}

const useSendbird = (): UseSendbirdReturn => {
  const { sdk } = useSendbirdChat()

  const getDistinctChatWithUser = async ({
    userProfileId,
  }: {
    userProfileId: string
  }): Promise<GroupChannel | undefined> => {
    const params: GroupChannelListQueryParams = {
      customTypesFilter: [ChannelType.DIRECT],
      userIdsFilter: {
        userIds: [userProfileId],
        includeMode: false,
        queryType: QueryType.AND,
      },
    }
    const query: GroupChannelListQuery =
      sdk.groupChannel.createMyGroupChannelListQuery(params)

    // Only channel A is returned in a result list through the groupChannels parameter of the callback function.
    const channels: GroupChannel[] = await query.next()
    if (channels.length > 0) {
      let channel = _.head(channels)
      if (!channel) {
        return undefined
      }

      while (channel) {
        if (channel.customType === ChannelType.DIRECT) {
          return channel
        }
        channel = _.head(channels.slice(1))
      }
      return channel
    }
    return undefined
  }

  const createGroupChat = async ({
    channelUrl,
    channelName,
    desc,
    tags,
    invitedUserIds,
    coverImage,
    operatorUserIds,
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
        isDistinct: channelType === ChannelType.DIRECT,
        isPublic: channelType !== ChannelType.DIRECT,
        customType: channelType,
      }

      channel = await sdk.groupChannel.createChannel(
        UTIL.noUndefinedObj(params)
      )
    }

    const data: MetaData = UTIL.filterUndefined<{
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
    const updateParam: Partial<FbChannel> = UTIL.filterUndefined<
      Partial<FbChannel>
    >({
      name: channelName,
      tags,
      desc,
      coverImage: channel.coverUrl,
    })
    await fsChannel.update(updateParam)

    return channel
  }

  const generateDmChannelUrl = (
    a: string | undefined,
    b: string | undefined
  ): string => uuidv5([String(a), String(b)].sort().join('-'), uuidv5.DNS)

  return { getDistinctChatWithUser, createGroupChat, generateDmChannelUrl }
}

export default useSendbird
