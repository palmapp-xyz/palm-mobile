import { Container, Header } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil'
import selectAssetStore from 'store/selectAssetStore'
import { Token } from 'types'

import ConfirmModal from './ConfirmModal'
import Contents from './Contents'

const SendTokenScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.SendNft>()
  const [showBottomSheet, setShowBottomSheet] = useState(false)

  const selectedToken = useRecoilValue(selectAssetStore.selectedToken)

  const [value, setValue] = useState<Token>('' as Token)

  return (
    <Container style={styles.container} keyboardAvoiding={true}>
      <Header right="close" onPressRight={navigation.goBack} />
      {selectedToken && (
        <>
          <Contents
            selectedToken={selectedToken}
            value={value}
            onSetValue={setValue}
            receiverId={params.receiverId}
            setShowBottomSheet={setShowBottomSheet}
          />
          <ConfirmModal
            selectedToken={selectedToken}
            value={value}
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

export default SendTokenScreen

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
