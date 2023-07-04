import { ChannelType, FbChannelGatingField } from 'palm-core/types'
import useFsChannel from 'palm-react/hooks/firestore/useFsChannel'
import { useEffect, useState } from 'react'

import { GroupChannel, Member } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

export type UseChannelInfoReturn = {
  channel?: GroupChannel
  channelName?: string
  channelImages?: string[]
  tags: string[]
  desc?: string
  gatingToken?: FbChannelGatingField
  loading: boolean
}

export const SENDBIRD_STATIC_SAMPLE = 'https://static.sendbird.com/sample'

const useChannelInfo = ({
  channelUrl,
}: {
  channelUrl: string
}): UseChannelInfoReturn => {
  const { fsChannelField } = useFsChannel({ channelUrl })

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

  const [loading, setLoading] = useState<boolean>(true)
  const [channelName, setChannelName] = useState<string>()
  const [channelImages, setChannelImages] = useState<string[]>()
  const [desc, setDesc] = useState<string>()
  const [tags, setTags] = useState<string[]>([])
  const [gatingToken, setGatingToken] = useState<FbChannelGatingField>()

  useEffect(() => {
    if (fsChannelField) {
      setTags(fsChannelField.tags ?? [])
      if (fsChannelField.desc) {
        setDesc(fsChannelField.desc)
      }
      if (fsChannelField.gating) {
        setGatingToken(fsChannelField.gating)
      }
    }
  }, [fsChannelField])

  useEffect(() => {
    if (!!channel && !!fsChannelField) {
      setLoading(false)
    }
  }, [channel, fsChannelField])

  useEffect(() => {
    if (channel) {
      setChannelName(
        channel.customType === ChannelType.DIRECT
          ? channel.members.map((member: Member) => member.nickname).join(', ')
          : channel.name
      )

      const channelMembers = channel.members.sort(a => (a.profileUrl ? -1 : 1))
      const displayUsers = [...channelMembers]
        .sort(a => (a.profileUrl ? 1 : -1))
        .slice(-3)
      setChannelImages(
        channel.customType === ChannelType.DIRECT ||
          channel.coverUrl.includes(SENDBIRD_STATIC_SAMPLE)
          ? displayUsers.map((member: Member) => member.profileUrl)
          : [channel.coverUrl]
      )
    }
  }, [channel])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  return {
    channel,
    channelImages,
    tags,
    channelName,
    desc,
    gatingToken,
    loading,
  }
}

export default useChannelInfo
