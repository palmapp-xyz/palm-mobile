import { logEvent } from 'firebase/analytics'
import _ from 'lodash'
import { analytics } from 'palm-core/firebase'
import { Routes } from 'palm-core/libs/navigation'
import { nftUriFetcher } from 'palm-core/libs/nft'
import { stringifyMsgData } from 'palm-core/libs/sendbird'
import {
  ContractAddr,
  Moralis,
  SbShareNftDataType,
  SbUserMetadata,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useDevice from 'palm-react-native/app/useDevice'
import useToast from 'palm-react-native/app/useToast'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useProfile from 'palm-react/hooks/auth/useProfile'
import selectAssetStore from 'palm-react/store/selectAssetStore'
import { useMemo, useState } from 'react'
import { SetterOrUpdater, useRecoilState } from 'recoil'

import { GroupChannel, Member } from '@sendbird/chat/groupChannel'
import {
  GroupChannelProps,
  useLocalization,
} from '@sendbird/uikit-react-native'

export type UseGcInputReturn = {
  receiverList: Member[]
  openSelectReceiver: 'send-nft' | 'send-token' | undefined
  setOpenSelectReceiver: (value: 'send-nft' | 'send-token' | undefined) => void
  openBottomMenu: boolean
  setOpenBottomMenu: (value: boolean) => void
  selectedNetwork: SupportedNetworkEnum
  selectedCollection?: Moralis.NftCollection
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Moralis.NftCollection | undefined>
  >
  stepAfterSelectItem?: StepAfterSelectItemType
  onPressList: () => void
  onPressShow: () => void
  onPressSend: (props: {
    stepAfterSelectItem?: StepAfterSelectItemType
    receiverId: string
  }) => void
  onPressClose: () => void
  selectedToken: Moralis.FtItem | undefined
  setSelectedToken: SetterOrUpdater<Moralis.FtItem | undefined>
  selectedNftList: Moralis.NftItem[]
  setSelectedNftList: SetterOrUpdater<Moralis.NftItem[]>
  onClickNextStep: () => Promise<void>
  runningNextStep: boolean
  onPressAttachment: () => void
  onChangeNetwork: (value: SupportedNetworkEnum) => void
}

export type StepAfterSelectItemType =
  | 'share'
  | 'send-nft'
  | 'send-token'
  | 'list'
  | 'album'

const useGcInput = ({
  channel,
  onSendFileMessage,
}: GroupChannelProps['Input'] & {
  channel: GroupChannel
}): UseGcInputReturn => {
  const { user } = useAuth()
  const { profile } = useProfile({ profileId: user?.auth?.profileId! })

  const [runningNextStep, setRunningNextStep] = useState(false)
  const [openSelectReceiver, setOpenSelectReceiver] = useState<
    'send-nft' | 'send-token' | undefined
  >(undefined)
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const [openBottomMenu, setOpenBottomMenu] = useState(false)

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollection, setSelectedCollection] =
    useState<Moralis.NftCollection>()

  const [selectedToken, setSelectedToken] = useRecoilState(
    selectAssetStore.selectedToken
  )
  const [selectedNftList, setSelectedNftList] = useRecoilState(
    selectAssetStore.selectedNftList
  )
  const [assetReceiverId, setAssetReceiverId] = useState('')
  const [_stepAfterSelectItem, setStepAfterSelectItem] =
    useState<StepAfterSelectItemType>()

  const onPressList = (): void => {
    setStepAfterSelectItem('list')
    setSelectedNftList([])
    setSelectedToken(undefined)
  }

  const onPressShow = (): void => {
    setStepAfterSelectItem('share')
    setSelectedNftList([])
    setSelectedToken(undefined)
  }

  const onPressSend = ({
    stepAfterSelectItem,
    receiverId,
  }: {
    stepAfterSelectItem?: StepAfterSelectItemType
    receiverId: string
  }): void => {
    setOpenSelectReceiver(undefined)
    setStepAfterSelectItem(stepAfterSelectItem ?? openSelectReceiver)
    setSelectedNftList([])
    setSelectedToken(undefined)
    setAssetReceiverId(receiverId)
  }

  const onPressClose = (): void => {
    setOpenBottomMenu(false)
    setStepAfterSelectItem(undefined)
  }

  const receiverList = useMemo(
    () => channel.members.filter(x => x.userId !== user?.auth?.profileId) || [],
    [channel.members]
  )

  const toast = useToast()
  const { STRINGS } = useLocalization()

  const onFailureToSend = (): void => {
    toast.show(STRINGS.TOAST.SEND_MSG_ERROR, { color: 'red', icon: 'info' })
  }

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
    setSelectedToken(undefined)
  }

  const onClickNextStep = async (): Promise<void> => {
    if (!profile) {
      return
    }

    setRunningNextStep(true)
    if (selectedNftList.length > 0) {
      if (_stepAfterSelectItem === 'share') {
        const fileMessages = await Promise.all(
          _.map(selectedNftList, async item => {
            const imgInfo = await nftUriFetcher(
              (item as Moralis.NftItem).token_uri
            )
            imgInfo.data = stringifyMsgData({
              type: 'share',
              selectedNft: item as Moralis.NftItem,
              owner: {
                profileId: profile.profileId,
                address: profile.address as ContractAddr,
                handle: profile.handle,
              } as SbUserMetadata,
            } as SbShareNftDataType)
            return imgInfo
          })
        )
        logEvent(analytics, 'share_nft')
        channel.sendFileMessages(fileMessages)
        onChangeNetwork(SupportedNetworkEnum.ETHEREUM)
      } else if (_stepAfterSelectItem === 'list') {
        logEvent(analytics, 'list_nft_click')
        navigation.navigate(Routes.ListNft, { channelUrl: channel.url })
        setSelectedNetwork(SupportedNetworkEnum.ETHEREUM)
        setSelectedCollection(undefined)
      } else if (_stepAfterSelectItem === 'send-nft') {
        logEvent(analytics, 'send_nft_click')
        navigation.navigate(Routes.SendNft, {
          receiverId: assetReceiverId,
          channelUrl: channel.url,
        })
        setSelectedNetwork(SupportedNetworkEnum.ETHEREUM)
        setSelectedCollection(undefined)
      }
    } else if (selectedToken) {
      if (_stepAfterSelectItem === 'send-token') {
        logEvent(analytics, 'send_token_click')
        navigation.navigate(Routes.SendToken, {
          receiverId: assetReceiverId,
          channelUrl: channel.url,
        })
        setSelectedNetwork(SupportedNetworkEnum.ETHEREUM)
        setSelectedCollection(undefined)
      }
    }
    setRunningNextStep(false)
    setStepAfterSelectItem(undefined)
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
    stepAfterSelectItem: _stepAfterSelectItem,
    onPressList,
    onPressShow,
    onPressSend,
    onPressClose,
    selectedToken,
    setSelectedToken,
    selectedNftList,
    setSelectedNftList,
    onClickNextStep,
    runningNextStep,
    onPressAttachment,
    onChangeNetwork,
  }
}

export default useGcInput
