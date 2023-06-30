import { Container, Header } from 'components'
import { Routes } from 'core/libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'core/libs/utils'
import selectNftStore from 'core/store/selectAssetStore'
import { Moralis, SupportedNetworkEnum } from 'core/types'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useZxListNft from 'hooks/zx/useZxListNft'
import React, { ReactElement, useState } from 'react'
import { useRecoilValue } from 'recoil'

import ConfirmModal from './ConfirmModal'
import Contents from './Contents'

const Body = ({
  channelUrl,
  selectedNft,
}: {
  channelUrl: string
  selectedNft: Moralis.NftItem
}): ReactElement => {
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const useZxListNftReturn = useZxListNft({
    nftContract: selectedNft.token_address,
    tokenId: selectedNft.token_id,
    chain,
    channelUrl,
  })

  return (
    <>
      <Contents
        selectedNft={selectedNft}
        chain={chain}
        setShowBottomSheet={setShowBottomSheet}
        useZxListNftReturn={useZxListNftReturn}
      />
      <ConfirmModal
        selectedNft={selectedNft}
        channelUrl={channelUrl}
        showBottomSheet={showBottomSheet}
        setShowBottomSheet={setShowBottomSheet}
        useZxListNftReturn={useZxListNftReturn}
      />
    </>
  )
}

const ListNftScreen = (): ReactElement => {
  const { params, navigation } = useAppNavigation<Routes.ListNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)

  return (
    <Container style={{ flex: 1 }}>
      <Header right="close" onPressRight={navigation.goBack} />
      {selectedNftList.length > 0 && (
        <Body channelUrl={params.channelUrl} selectedNft={selectedNftList[0]} />
      )}
    </Container>
  )
}

export default ListNftScreen
