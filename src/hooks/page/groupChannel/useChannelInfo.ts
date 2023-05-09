import useFsChannel from 'hooks/firestore/useFsChannel'
import { useEffect, useState } from 'react'
import { FbChannelGatingField } from 'types'

import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

export type UseChannelInfoReturn = {
  channel?: GroupChannel
  channelName?: string
  channelImage?: string
  tags: string[]
  desc?: string
  gatingToken?: FbChannelGatingField
  loading: boolean
}

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
  const [channelImage, setChannelImage] = useState<string>()
  const [desc, setDesc] = useState<string>()
  const [tags, setTags] = useState<string[]>([])
  const [gatingToken, setGatingToken] = useState<FbChannelGatingField>()

  useEffect(() => {
    if (fsChannelField) {
      setChannelName(fsChannelField.name ?? channelUrl)
      setTags(fsChannelField.tags ?? [])
      if (fsChannelField.desc) {
        setDesc(fsChannelField.desc)
      }
      if (fsChannelField.coverImage) {
        setChannelImage(fsChannelField.coverImage)
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
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  return {
    channel,
    channelImage,
    tags,
    channelName,
    desc,
    gatingToken,
    loading,
  }
}

export default useChannelInfo
