import { useMemo, useState } from 'react'
import { Alert } from 'react-native'
import _ from 'lodash'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import { GroupChannel, Member } from '@sendbird/chat/groupChannel'
import { GroupChannelProps } from '@sendbird/uikit-react-native'

import { useToast, useAlert } from '@sendbird/uikit-react-native-foundation'
import {
  FileType,
  useLocalization,
  usePlatformService,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'
import SBUError from '@sendbird/uikit-react-native/src/libs/SBUError'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'

import { Moralis } from 'types'
import selectNftStore from 'store/selectNftStore'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { nftUriFetcher } from 'libs/nft'
import { Routes } from 'libs/navigation'
import useAuth from 'hooks/independent/useAuth'
import { stringifySendFileData } from 'libs/sendbird'

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
  runningNextStep: boolean
  onPressAttachment: () => void
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
  const [selectedNftList, setSelectedNftList] = useRecoilState(
    selectNftStore.selectedNftList
  )
  const [stepAfterSelectNft, setStepAfterSelectNft] =
    useState<StepAfterSelectNftType>()

  const receiverList = useMemo(
    () => channel.members.filter(x => x.userId !== user?.profileId) || [],
    [channel.members]
  )

  const { alert } = useAlert()
  const { features, imageCompressionConfig } = useSendbirdChat()
  const { fileService, mediaService } = usePlatformService()
  const toast = useToast()
  const { STRINGS } = useLocalization()
  const sendFileMessage = (file: FileType): void => {
    onSendFileMessage(file).catch(onFailureToSend)
  }

  const onFailureToSend = (): void =>
    toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error')

  const onPressAttachment = async (): Promise<void> => {
    const mediaFiles = await fileService.openMediaLibrary({
      selectionLimit: 1,
      mediaType: 'all',
      onOpenFailure: error => {
        if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
          alert({
            title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
            message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
              STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
              STRINGS.LABELS.PERMISSION_APP_NAME
            ),
            buttons: [
              {
                text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK,
                onPress: () => SBUUtils.openSettings(),
              },
            ],
          })
        } else {
          toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error')
        }
      },
    })

    if (mediaFiles && mediaFiles[0]) {
      const mediaFile = mediaFiles[0]

      // Image compression
      if (
        isImage(mediaFile.uri, mediaFile.type) &&
        shouldCompressImage(mediaFile.type, features.imageCompressionEnabled)
      ) {
        await SBUUtils.safeRun(async () => {
          const compressed = await mediaService.compressImage({
            uri: mediaFile.uri,
            maxWidth: imageCompressionConfig.width,
            maxHeight: imageCompressionConfig.height,
            compressionRate: imageCompressionConfig.compressionRate,
          })

          if (compressed) {
            mediaFile.uri = compressed.uri
            mediaFile.size = compressed.size
          }
        })
      }

      sendFileMessage(mediaFile)
    }
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
        setSelectedNftList([])
      } else if (stepAfterSelectNft === 'list') {
        navigation.navigate(Routes.ListNft, { channelUrl: channel.url })
      } else if (stepAfterSelectNft === 'send') {
        if (channel.members.length < 3) {
          const target = channel.members.find(x => x.userId !== user?.profileId)
          if (target) {
            navigation.navigate(Routes.SendNft, {
              receiverId: target.userId,
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
    stepAfterSelectNft,
    setStepAfterSelectNft,
    selectedNftList,
    setSelectedNftList,
    onClickNextStep,
    runningNextStep,
    onPressAttachment,
  }
}

export default useGcInput
