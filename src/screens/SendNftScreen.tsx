import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRecoilValue } from 'recoil'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { UTIL } from 'consts'
import { ContractAddr, Moralis } from 'types'
import selectNftStore from 'store/selectNftStore'
import { Header, SubmitButton, Container, NftRenderer, Row } from 'components'
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
  const { isPosting, isValidForm, onClickConfirm } = useSendNft({
    selectedNft,
    receiver,
  })

  return (
    <View style={styles.body}>
      <View>
        <Row style={{ paddingBottom: 10 }}>
          <View style={{ width: 100, height: 100, marginEnd: 10 }}>
            <NftRenderer
              nftContract={selectedNft.token_address}
              tokenId={selectedNft.token_id}
            />
          </View>
          <View style={{ rowGap: 10 }}>
            <Text>Address : {UTIL.truncate(selectedNft.token_address)}</Text>
            <Text>ID : {selectedNft.token_id}</Text>
          </View>
        </Row>
        <View>
          <Text style={{ fontSize: 20 }}>Receiver</Text>
          <Text>{receiver}</Text>
        </View>
      </View>
      <SubmitButton
        disabled={isPosting || !isValidForm}
        onPress={onClickConfirm}>
        Send
      </SubmitButton>
    </View>
  )
}

const SendNftScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.SendNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)

  return (
    <Container style={styles.container}>
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
  container: {
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
