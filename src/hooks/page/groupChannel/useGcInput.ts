import useAuth from 'hooks/auth/useAuth'
import useDevice from 'hooks/complex/useDevice'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import selectNftStore from 'store/selectNftStore'
import { Moralis, SupportedNetworkEnum } from 'types'

import { GroupChannel, Member } from '@sendbird/chat/groupChannel'
import {
  GroupChannelProps,
  useLocalization,
} from '@sendbird/uikit-react-native'
import { useToast } from '@sendbird/uikit-react-native-foundation'

export type UseGcInputReturn = {
  receiverList: Member[]
  openSelectReceiver: boolean
  setOpenSelectReceiver: (value: boolean) => void
  openBottomMenu: boolean
  setOpenBottomMenu: (value: boolean) => void
  selectedNetwork: SupportedNetworkEnum
  selectedCollection?: Moralis.NftCollection
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Moralis.NftCollection | undefined>
  >
  stepAfterSelectNft?: StepAfterSelectNftType
  onPressList: () => void
  onPressShow: () => void
  onPressSend: (props: { receiverId: string }) => void
  onPressClose: () => void
  selectedNftList: Moralis.NftItem[]
  setSelectedNftList: SetterOrUpdater<Moralis.NftItem[]>
  onClickNextStep: () => Promise<void>
  runningNextStep: boolean
  onPressAttachment: () => void
  onChangeNetwork: (value: SupportedNetworkEnum) => void
}

export type StepAfterSelectNftType = 'share' | 'send' | 'list' | 'album'

const useGcInput = ({
  channel,
  onSendFileMessage,
}: GroupChannelProps['Input'] & {
  channel: GroupChannel
}): UseGcInputReturn => {
  const { user } = useAuth()
  const [runningNextStep, setRunningNextStep] = useState(false)
  const [openSelectReceiver, setOpenSelectReceiver] = useState(false)
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const [openBottomMenu, setOpenBottomMenu] = useState(false)

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollection, setSelectedCollection] =
    useState<Moralis.NftCollection>()

  const [selectedNftList, setSelectedNftList] = useRecoilState(
    selectNftStore.selectedNftList
  )
  const [nftReceiverId, setNftReceiverId] = useState('')
  const [stepAfterSelectNft, setStepAfterSelectNft] =
    useState<StepAfterSelectNftType>()

  const onPressList = (): void => {
    setStepAfterSelectNft('list')
    setSelectedNftList([])
  }

  const onPressShow = (): void => {
    setStepAfterSelectNft('share')
    setSelectedNftList([])
  }

  const onPressSend = ({ receiverId }: { receiverId: string }): void => {
    setOpenSelectReceiver(false)
    setStepAfterSelectNft('send')
    setSelectedNftList([])
    setNftReceiverId(receiverId)
  }

  const onPressClose = (): void => {
    setOpenBottomMenu(false)
    setStepAfterSelectNft(undefined)
  }

  const receiverList = useMemo(
    () => channel.members.filter(x => x.userId !== user?.auth?.profileId) || [],
    [channel.members]
  )

  const toast = useToast()
  const { STRINGS } = useLocalization()

  const onFailureToSend = (): void =>
    toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error')

  const { getMediaFile } = useDevice()

  const onPressAttachment = async (): Promise<void> => {
    const mediaFile = await getMediaFile()
    if (mediaFile) {
      onSendFileMessage?.(mediaFile).catch(onFailureToSend)
    }
  }

  const onChangeNetwork = (value: SupportedNetworkEnum): void => {
    setSelectedNetwork(value)
    setSelectedCollection(undefined)
    setSelectedNftList([])
  }

  const onClickNextStep = async (): Promise<void> => {
    setRunningNextStep(true)
    if (selectedNftList.length > 0) {
      if (stepAfterSelectNft === 'share') {
        const fileMessages = await Promise.all(
          _.map(selectedNftList, async item => {
            const imgInfo = await nftUriFetcher(item.token_uri)
            imgInfo.data = stringifySendFileData({
              type: 'share',
              selectedNft: item,
            })
            return imgInfo
          })
        )
        channel.sendFileMessages(fileMessages)
        onChangeNetwork(SupportedNetworkEnum.ETHEREUM)
      } else if (stepAfterSelectNft === 'list') {
        navigation.navigate(Routes.ListNft, { channelUrl: channel.url })
        setSelectedNetwork(SupportedNetworkEnum.ETHEREUM)
        setSelectedCollection(undefined)
      } else if (stepAfterSelectNft === 'send') {
        navigation.navigate(Routes.SendNft, {
          receiverId: nftReceiverId,
          channelUrl: channel.url,
        })
        setSelectedNetwork(SupportedNetworkEnum.ETHEREUM)
        setSelectedCollection(undefined)
      }
    } else {
      // Should not be clickable this button without selectedNft
    }
    setRunningNextStep(false)
    setStepAfterSelectNft(undefined)
    setOpenBottomMenu(false)
  }

  return {
    receiverList,
    openSelectReceiver,
    setOpenSelectReceiver,
    openBottomMenu,
    setOpenBottomMenu,
    selectedNetwork,
    selectedCollection,
    setSelectedCollection,
    stepAfterSelectNft,
    onPressList,
    onPressShow,
    onPressSend,
    onPressClose,
    selectedNftList,
    setSelectedNftList,
    onClickNextStep,
    runningNextStep,
    onPressAttachment,
    onChangeNetwork,
  }
}

export default useGcInput
