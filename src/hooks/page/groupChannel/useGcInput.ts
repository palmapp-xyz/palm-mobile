import { useState } from 'react'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'
import { FileType, usePlatformService } from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'

import { Moralis } from 'types'
import { nftUriFetcher } from 'libs/nft'
import { useRecoilState, useSetRecoilState } from 'recoil'
import groupChannelStore from 'store/groupChannelStore'

export type UseGcInputReturn = {
  openBottomMenu: boolean
  setOpenBottomMenu: (value: boolean) => void
  stepAfterSelectNft?: StepAfterSelectNftType
  setStepAfterSelectNft: (value?: StepAfterSelectNftType) => void
  selectedNft?: Moralis.NftItem
  setSelectedNft: (value?: Moralis.NftItem) => void
  onClickNextStep: () => Promise<void>
}

type StepAfterSelectNftType = 'share' | 'send' | 'sell'

const useGcInput = ({
  onSendFileMessage,
}: {
  onSendFileMessage: (file: FileType) => Promise<void>
}): UseGcInputReturn => {
  const [openBottomMenu, setOpenBottomMenu] = useState(false)
  const [selectedNft, setSelectedNft] = useRecoilState(
    groupChannelStore.selectedNft
  )
  const setVisibleModal = useSetRecoilState(groupChannelStore.visibleModal)
  const [stepAfterSelectNft, setStepAfterSelectNft] =
    useState<StepAfterSelectNftType>()

  const { mediaService } = usePlatformService()

  const onClickNextStep = async (): Promise<void> => {
    if (selectedNft) {
      if (stepAfterSelectNft === 'share') {
        const imgInfo = await nftUriFetcher(selectedNft.token_uri)

        // Image compression
        if (
          imgInfo.type.includes('svg') === false &&
          isImage(imgInfo.uri, imgInfo.type) &&
          shouldCompressImage(imgInfo.uri, true)
        ) {
          await SBUUtils.safeRun(async () => {
            const compressed = await mediaService.compressImage({
              uri: imgInfo.uri,
              compressionRate: 0.7,
            })

            if (compressed) {
              imgInfo.uri = compressed.uri
              imgInfo.size = compressed.size
            }
          })
        }

        onSendFileMessage(imgInfo)
      } else if (stepAfterSelectNft === 'sell') {
      } else if (stepAfterSelectNft === 'send') {
        setVisibleModal('send')
      }
    } else {
      // Should not be clickable this button without selectedNft
    }

    setStepAfterSelectNft(undefined)
    setOpenBottomMenu(false)
  }

  return {
    openBottomMenu,
    setOpenBottomMenu,
    stepAfterSelectNft,
    setStepAfterSelectNft,
    selectedNft,
    setSelectedNft,
    onClickNextStep,
  }
}

export default useGcInput
