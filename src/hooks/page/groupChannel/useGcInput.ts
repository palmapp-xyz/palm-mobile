import { useState } from 'react'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'
import { FileType, usePlatformService } from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'

import { Moralis } from 'types'
import { nftUriFetcher } from 'libs/nft'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import selectNftStore from 'store/selectNftStore'
import _ from 'lodash'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

export type UseGcInputReturn = {
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
  onSendFileMessage,
}: {
  onSendFileMessage: (file: FileType) => Promise<void>
}): UseGcInputReturn => {
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const [openBottomMenu, setOpenBottomMenu] = useState(false)
  const [selectedNftList, setSelectedNftList] = useRecoilState(
    selectNftStore.selectedNftList
  )
  const [stepAfterSelectNft, setStepAfterSelectNft] =
    useState<StepAfterSelectNftType>()

  const { mediaService } = usePlatformService()

  const onClickNextStep = async (): Promise<void> => {
    if (selectedNftList.length > 0) {
      if (stepAfterSelectNft === 'share') {
        await Promise.all(
          _.forEach(selectedNftList, async item => {
            const imgInfo = await nftUriFetcher(item.token_uri)

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
          })
        )
        setSelectedNftList([])
      } else if (stepAfterSelectNft === 'sell') {
        // TODO : able to include group channel url
        navigation.navigate(Routes.SellNft)
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
    selectedNftList,
    setSelectedNftList,
    onClickNextStep,
  }
}

export default useGcInput
