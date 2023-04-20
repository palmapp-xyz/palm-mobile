import { useState } from 'react'
import { FilePickerResponse } from '@sendbird/uikit-react-native'

import useDevice from 'hooks/complex/useDevice'
import useFsTags from 'hooks/firestore/useFsTags'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useSendbird from 'hooks/sendbird/useSendbird'
import useAuth from 'hooks/independent/useAuth'
import { Routes } from 'libs/navigation'
import { getFsChannel } from 'libs/firebase'
import {
  ContractAddr,
  FbChannelNativeGatingField,
  FbChannelNFTGatingField,
  FbTags,
  Moralis,
  SupportedNetworkEnum,
  TokenSymbolEnum,
} from 'types'

export type UseCreateChannelReturn = {
  fsTags?: FbTags
  channelImage?: FilePickerResponse
  setChannelImage: React.Dispatch<
    React.SetStateAction<FilePickerResponse | undefined>
  >
  selectedTagIds: string[]
  setSelectedTagIds: React.Dispatch<React.SetStateAction<string[]>>
  channelName: string
  setChannelName: React.Dispatch<React.SetStateAction<string>>
  desc: string
  setDesc: React.Dispatch<React.SetStateAction<string>>
  showTokenGating: boolean
  setShowTokenGating: React.Dispatch<React.SetStateAction<boolean>>
  selectedGatingToken?: Moralis.NftCollection | TokenSymbolEnum
  setSelectedGatingToken: React.Dispatch<
    React.SetStateAction<Moralis.NftCollection | TokenSymbolEnum | undefined>
  >
  gateTokenAddr?: TokenSymbolEnum | ContractAddr
  gatingTokenAmount: string
  setGatingTokenAmount: React.Dispatch<React.SetStateAction<string>>
  gatingTokenNetwork: SupportedNetworkEnum
  setGatingTokenNetwork: React.Dispatch<
    React.SetStateAction<SupportedNetworkEnum>
  >
  isValidForm: boolean
  onClickGetFile: () => Promise<void>
  onClickConfirm: () => Promise<void>
}

const useCreateChannel = (): UseCreateChannelReturn => {
  const { navigation } = useAppNavigation()
  const [channelImage, setChannelImage] = useState<FilePickerResponse>()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [channelName, setChannelName] = useState('')
  const [desc, setDesc] = useState('')
  const [showTokenGating, setShowTokenGating] = useState(false)
  const [selectedGatingToken, setSelectedGatingToken] = useState<
    Moralis.NftCollection | TokenSymbolEnum
  >()
  const gateTokenAddr =
    typeof selectedGatingToken === 'string'
      ? selectedGatingToken
      : selectedGatingToken?.token_address
  const [gatingTokenAmount, setGatingTokenAmount] = useState('')
  const [gatingTokenNetwork, setGatingTokenNetwork] =
    useState<SupportedNetworkEnum>(SupportedNetworkEnum.ETHEREUM)

  const { user } = useAuth()
  const { createGroupChat } = useSendbird()

  const { getMediaFile } = useDevice()
  const { fsTags } = useFsTags()

  const isValidForm = !!channelName

  const onClickGetFile = async (): Promise<void> => {
    const mediaFile = await getMediaFile()
    setChannelImage(mediaFile)
  }

  const onClickConfirm = async (): Promise<void> => {
    if (user) {
      try {
        const channel = await createGroupChat({
          invitedUserIds: [user.profileId],
          operatorUserIds: [user.profileId],
          coverImage: channelImage,
          channelName,
        })

        const fsChannel = await getFsChannel({
          channel,
          channelUrl: channel.url,
        })

        const updateParam: any = {
          tags: selectedTagIds.map(key => fsTags?.[key]),
          desc,
        }

        if (selectedGatingToken) {
          if (typeof selectedGatingToken === 'string') {
            const gating: FbChannelNativeGatingField = {
              gatingType: 'Native',
              amount: gatingTokenAmount,
              chain: gatingTokenNetwork,
            }
            updateParam.gating = gating
          } else {
            const gating: FbChannelNFTGatingField = {
              gatingType: 'NFT',
              tokenAddress: selectedGatingToken.token_address,
              amount: gatingTokenAmount,
              chain: gatingTokenNetwork,
            }
            updateParam.gating = gating
          }
        }

        await fsChannel.update(updateParam)

        navigation.replace(Routes.GroupChannel, {
          channelUrl: channel.url,
        })
      } catch (error) {
        console.log('error : ', JSON.stringify(error))
      }
    }
  }

  return {
    fsTags,
    channelImage,
    setChannelImage,
    selectedTagIds,
    setSelectedTagIds,
    channelName,
    setChannelName,
    desc,
    setDesc,
    showTokenGating,
    setShowTokenGating,
    selectedGatingToken,
    setSelectedGatingToken,
    gateTokenAddr,
    gatingTokenAmount,
    setGatingTokenAmount,
    gatingTokenNetwork,
    setGatingTokenNetwork,
    isValidForm,
    onClickGetFile,
    onClickConfirm,
  }
}

export default useCreateChannel
