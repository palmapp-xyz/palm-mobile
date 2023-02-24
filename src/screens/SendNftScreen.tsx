import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRecoilValue } from 'recoil'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { ContractAddr, Moralis } from 'types'
import selectNftStore from 'store/selectNftStore'
import { Header, SubmitButton, Container } from 'components'
import useSendNft from 'hooks/page/groupChannel/useSendNft'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const Contents = ({
  selectedNft,
  receiver,
}: {
  selectedNft: Moralis.NftItem
  receiver: ContractAddr
}): ReactElement => {
  const { isValidForm, onClickConfirm } = useSendNft({ selectedNft, receiver })

  return (
    <View style={styles.body}>
      <View>
        <Text style={{ fontSize: 20 }}>Receiver</Text>
        <Text>{receiver}</Text>
      </View>
      <SubmitButton disabled={!isValidForm} onPress={onClickConfirm}>
        Send
      </SubmitButton>
    </View>
  )
}

const SendNftScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.SendNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)

  return (
    <Container>
      <Header
        title="Send NFT"
        left={<Icon icon={'close'} />}
        onPressLeft={navigation.goBack}
      />
      {selectedNftList.length > 0 && (
        <Contents selectedNft={selectedNftList[0]} receiver={params.receiver} />
      )}
    </Container>
  )
}

export default SendNftScreen

const styles = StyleSheet.create({
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
