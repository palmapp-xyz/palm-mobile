import { NETWORK } from 'palm-core/consts'
import { updateDoc } from 'palm-core/firebase'
import { UTIL } from 'palm-core/libs'
import { recordError } from 'palm-core/libs/logger'
import { Routes } from 'palm-core/libs/navigation'
import {
  FbChannel,
  FbChannelGatingField,
  SupportedNetworkEnum,
} from 'palm-core/types'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useDevice from 'palm-react/hooks/complex/useDevice'
import useFsChannel from 'palm-react/hooks/firestore/useFsChannel'
import { useAppNavigation } from 'palm-react/hooks/useAppNavigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MetaData } from '@sendbird/chat'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  FilePickerResponse,
  useLocalization,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

export type UseEditChannelReturn = {
  prevCoverImage: string
  channelImage?: FilePickerResponse
  setChannelImage: React.Dispatch<
    React.SetStateAction<FilePickerResponse | undefined>
  >
  tags: string[]
  inputTag: string
  setInputTag: React.Dispatch<React.SetStateAction<string>>
  channelName: string
  setChannelName: React.Dispatch<React.SetStateAction<string>>
  desc: string
  setDesc: React.Dispatch<React.SetStateAction<string>>
  showTokenGating: boolean
  setShowTokenGating: React.Dispatch<React.SetStateAction<boolean>>
  defaultGatingToken: FbChannelGatingField
  selectedGatingToken: FbChannelGatingField
  setSelectedGatingToken: React.Dispatch<
    React.SetStateAction<FbChannelGatingField>
  >
  updateGatingTokenAmount: (amount: string) => void
  updateGatingTokenNetwork: (chain: SupportedNetworkEnum) => void
  isValidForm: boolean
  onClickGetFile: () => Promise<void>
  onClickConfirm: () => Promise<void>
}

const useEditChannel = ({
  channelUrl,
}: {
  channelUrl: string
}): UseEditChannelReturn => {
  const { navigation } = useAppNavigation()
  const { fsChannel, fsChannelField } = useFsChannel({ channelUrl })

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)
  const { alert } = useAlert()
  const { STRINGS } = useLocalization()

  const [prevCoverImage, setPrevCoverImage] = useState('')
  const [coverImage, setCoverImage] = useState<FilePickerResponse>()
  const [inputTag, setInputTag] = useState('')
  const [channelName, setChannelName] = useState('')
  const [desc, setDesc] = useState('')
  const [showTokenGating, setShowTokenGating] = useState(false)
  const defaultGatingToken: FbChannelGatingField = {
    gatingType: 'Native',
    chain: SupportedNetworkEnum.ETHEREUM,
    name: NETWORK.nativeToken[SupportedNetworkEnum.ETHEREUM],
    amount: '',
  }
  const [selectedGatingToken, setSelectedGatingToken] =
    useState<FbChannelGatingField>(defaultGatingToken)

  const tags = useMemo(
    () =>
      inputTag
        .split(',')
        .map(x => x.trim())
        .filter(x => !!x),
    [inputTag]
  )
  const { user } = useAuth()
  const { t } = useTranslation()

  const { getMediaFile } = useDevice()

  useEffect(() => {
    if (fsChannelField) {
      setInputTag(fsChannelField.tags.join(','))
      setChannelName(fsChannelField.name)
      setDesc(fsChannelField.desc)
      setSelectedGatingToken(fsChannelField.gating || defaultGatingToken)
      setPrevCoverImage(fsChannelField.coverImage || '')
    }
  }, [fsChannelField])

  const isValidForm = !!channelName && channel?.myRole === 'operator'

  const updateGatingTokenAmount = (amount: string): void => {
    setSelectedGatingToken(ori => ({ ...ori, amount }))
  }

  const updateGatingTokenNetwork = (chain: SupportedNetworkEnum): void => {
    setSelectedGatingToken({
      ...defaultGatingToken,
      chain: chain,
      name: NETWORK.nativeToken[chain],
    })
  }

  const onClickGetFile = async (): Promise<void> => {
    const mediaFile = await getMediaFile()
    setCoverImage(mediaFile)
  }

  const onClickConfirm = async (): Promise<void> => {
    if (user && fsChannel && channel) {
      try {
        const updates: Promise<GroupChannel | MetaData>[] = []
        if (coverImage) {
          updates.push(channel.updateChannel({ coverImage }))
        }
        if (channelName !== channel.name) {
          updates.push(channel.updateChannel({ name: channelName }))
        }
        updates.push(
          channel.updateMetaData(
            UTIL.filterUndefined<{ [key: string]: string | undefined }>({
              desc,
              tags: JSON.stringify(tags),
            }) as MetaData
          )
        )
        await Promise.all(updates)

        const updateParam: Partial<FbChannel> = {
          name: channelName,
          tags,
          desc,
          coverImage: channel.coverUrl,
        }

        if (selectedGatingToken) {
          updateParam.gating = selectedGatingToken
        }
        await updateDoc(fsChannel, updateParam)

        alert({
          message: t('Channels.ChannelInfoUpdatedAlertMessage'),
          buttons: [
            {
              text: STRINGS.DIALOG.ALERT_DEFAULT_OK,
              onPress: () =>
                navigation.navigate(Routes.GroupChannel, { channelUrl }),
            },
          ],
        })
      } catch (error) {
        console.error(JSON.stringify(error))
        recordError(error, 'useEditChannel:onClickConfirm')
      }
    }
  }

  return {
    prevCoverImage,
    channelImage: coverImage,
    setChannelImage: setCoverImage,
    tags,
    inputTag,
    setInputTag,
    channelName,
    setChannelName,
    desc,
    setDesc,
    showTokenGating,
    setShowTokenGating,
    selectedGatingToken,
    defaultGatingToken,
    setSelectedGatingToken,
    updateGatingTokenAmount,
    updateGatingTokenNetwork,
    isValidForm,
    onClickGetFile,
    onClickConfirm,
  }
}

export default useEditChannel
