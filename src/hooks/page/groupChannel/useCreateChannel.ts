import useAuth from 'hooks/auth/useAuth'
import useDevice from 'hooks/complex/useDevice'
import useSendbird from 'hooks/sendbird/useSendbird'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { NETWORK } from 'palm-core/consts'
import { getFsChannel } from 'palm-core/libs/firebase'
import { recordError } from 'palm-core/libs/logger'
import { Routes } from 'palm-core/libs/navigation'
import {
  ChannelType,
  FbChannel,
  FbChannelGatingField,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useMemo, useState } from 'react'

import { FilePickerResponse } from '@sendbird/uikit-react-native'

export type UseCreateChannelReturn = {
  isLoading: boolean
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

const useCreateChannel = (): UseCreateChannelReturn => {
  const { navigation } = useAppNavigation()
  const [isLoading, setIsLoading] = useState(false)
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
  const { createGroupChat } = useSendbird()

  const { getMediaFile } = useDevice()

  const isValidForm = !!channelName

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
    if (user) {
      setIsLoading(true)
      try {
        const channel = await createGroupChat({
          invitedUserIds: [user.auth!.profileId],
          operatorUserIds: [user.auth!.profileId],
          coverImage,
          channelName,
          tags,
          desc,
          channelType: ChannelType.GROUP,
        })

        if (selectedGatingToken) {
          const fsChannel = await getFsChannel({
            channel,
            channelUrl: channel.url,
          })
          await fsChannel.update({
            gating: selectedGatingToken,
          } as Partial<FbChannel>)
        }

        navigation.replace(Routes.GroupChannel, {
          channelUrl: channel.url,
        })
      } catch (error) {
        console.error(JSON.stringify(error))
        recordError(error, 'useEditChannel:onClickConfirm')
      }
    }
    setIsLoading(false)
  }

  return {
    isLoading,
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
    defaultGatingToken,
    selectedGatingToken,
    setSelectedGatingToken,
    updateGatingTokenAmount,
    updateGatingTokenNetwork,
    isValidForm,
    onClickGetFile,
    onClickConfirm,
  }
}

export default useCreateChannel
