import { useState } from 'react'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'
import { FileType, usePlatformService } from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'

import { Moralis } from 'types'
import { nftUriFetcher } from 'libs/nft'

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
  const [selectedNft, setSelectedNft] = useState<Moralis.NftItem>()
  const [stepAfterSelectNft, setStepAfterSelectNft] =
    useState<StepAfterSelectNftType>()

  const { mediaService } = usePlatformService()

  const onClickNextStep = async (): Promise<void> => {
    if (selectedNft) {
      if (stepAfterSelectNft === 'share') {
        const imgInfo = await nftUriFetcher(selectedNft.token_uri)

        // Image compression
        if (
          false === imgInfo.type.includes('svg') &&
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
