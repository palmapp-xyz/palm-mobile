import { useMemo, useState } from 'react'
import { Alert } from 'react-native'
import _ from 'lodash'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import { GroupChannel, Member } from '@sendbird/chat/groupChannel'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'
import {
  usePlatformService,
  GroupChannelProps,
} from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'

import { ContractAddr, Moralis } from 'types'
import { getNftMessageParam, nftUriFetcher } from 'libs/nft'
import selectNftStore from 'store/selectNftStore'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useAuth from 'hooks/independent/useAuth'

export type UseGcInputReturn = {
  receiverList: Member[]
  openSelectReceiver: boolean
  setOpenSelectReceiver: (value: boolean) => void
  openBottomMenu: boolean
  setOpenBottomMenu: (value: boolean) => void
  stepAfterSelectNft?: StepAfterSelectNftType
  setStepAfterSelectNft: (value?: StepAfterSelectNftType) => void
  selectedNftList: Moralis.NftItem[]
  setSelectedNftList: SetterOrUpdater<Moralis.NftItem[]>
  onClickNextStep: () => Promise<void>
}

type StepAfterSelectNftType = 'share' | 'send' | 'sell'

const useGcInput = ({
  channel,
}: GroupChannelProps['Input'] & {
  channel: GroupChannel
}): UseGcInputReturn => {
  const { user } = useAuth()
  const [openSelectReceiver, setOpenSelectReceiver] = useState(false)
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const [openBottomMenu, setOpenBottomMenu] = useState(false)
  const [selectedNftList, setSelectedNftList] = useRecoilState(
    selectNftStore.selectedNftList
  )
  const [stepAfterSelectNft, setStepAfterSelectNft] =
    useState<StepAfterSelectNftType>()

  const { mediaService } = usePlatformService()

  const receiverList = useMemo(
    () => channel.members.filter(x => x.userId !== user?.address) || [],
    [channel.members]
  )

  const onClickNextStep = async (): Promise<void> => {
    if (selectedNftList.length > 0) {
      if (stepAfterSelectNft === 'share') {
        await Promise.all(
          _.forEach(selectedNftList, async item => {
            const imgInfo = await getNftMessageParam({
              mediaService,
              uri: item.token_uri,
            })
            imgInfo.customType = 'share'
            imgInfo.data = imgInfo.fileUrl
            channel.sendFileMessage(imgInfo)
          })
        )
        setSelectedNftList([])
      } else if (stepAfterSelectNft === 'sell') {
        navigation.navigate(Routes.SellNft, { channelUrl: channel.url })
      } else if (stepAfterSelectNft === 'send') {
        if (channel.members.length < 3) {
          const target = channel.members.find(x => x.userId !== user?.address)
          if (target) {
            navigation.navigate(Routes.SendNft, {
              receiver: target.userId as ContractAddr,
              channelUrl: channel.url,
            })
          } else {
            Alert.alert('No one to receive NFT here')
          }
        } else {
          setOpenSelectReceiver(true)
        }
      }
    } else {
      // Should not be clickable this button without selectedNft
    }

    setStepAfterSelectNft(undefined)
    setOpenBottomMenu(false)
  }

  return {
    receiverList,
    openSelectReceiver,
    setOpenSelectReceiver,
    openBottomMenu,
    setOpenBottomMenu,
    stepAfterSelectNft,
    setStepAfterSelectNft,
    selectedNftList,
    setSelectedNftList,
    onClickNextStep,
  }
}

export default useGcInput
