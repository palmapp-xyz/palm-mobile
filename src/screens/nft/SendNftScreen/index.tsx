import { Container, Header } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'palm-core/libs/navigation'
import selectAssetStore from 'palm-react/store/selectAssetStore'
import React, { ReactElement, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil'

import ConfirmModal from './ConfirmModal'
import Contents from './Contents'

const SendNftScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.SendNft>()
  const [showBottomSheet, setShowBottomSheet] = useState(false)

  const selectedNftList = useRecoilValue(selectAssetStore.selectedNftList)

  return (
    <Container style={styles.container}>
      <Header right="close" onPressRight={navigation.goBack} />
      {selectedNftList.length > 0 && (
        <>
          <Contents
            selectedNft={selectedNftList[0]}
            receiverId={params.receiverId}
            setShowBottomSheet={setShowBottomSheet}
          />
          <ConfirmModal
            selectedNft={selectedNftList[0]}
            receiverId={params.receiverId}
            channelUrl={params.channelUrl}
            showBottomSheet={showBottomSheet}
            setShowBottomSheet={setShowBottomSheet}
          />
        </>
      )}
    </Container>
  )
}

export default SendNftScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
