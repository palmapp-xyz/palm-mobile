import React, { ReactElement } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'
import { useRecoilValue } from 'recoil'

import { UTIL } from 'consts'
import { Moralis, Token } from 'types'
import {
  Header,
  SubmitButton,
  FormInput,
  Container,
  Row,
  NftRenderer,
} from 'components'
import useZxSellNft from 'hooks/zx/useZxSellNft'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import selectNftStore from 'store/selectNftStore'

const Contents = ({
  selectedNft,
}: {
  selectedNft: Moralis.NftItem
}): ReactElement => {
  const { price, setPrice, isApproved, onClickApprove, onClickConfirm } =
    useZxSellNft({
      nftContract: selectedNft.token_address,
      tokenId: selectedNft.token_id,
    })

  return (
    <View style={styles.body}>
      <View>
        <Row style={{ paddingBottom: 10 }}>
          <View style={{ width: 100, height: 100 }}>
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
        <Text style={{ fontSize: 20 }}>Price</Text>
        <FormInput
          keyboardType="number-pad"
          value={price}
          onChangeText={(value): void => {
            setPrice(value as Token)
          }}
        />
      </View>
      {isApproved ? (
        <SubmitButton
          disabled={!price}
          onPress={(): void => {
            Keyboard.dismiss()
            onClickConfirm()
          }}>
          List up to sell
        </SubmitButton>
      ) : (
        <View>
          <SubmitButton
            onPress={(): void => {
              Keyboard.dismiss()
              onClickApprove()
            }}>
            Approve
          </SubmitButton>
          <Text>Approve to sell item</Text>
        </View>
      )}
    </View>
  )
}

const SellNftScreentsx = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.SellNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)

  return (
    <Container style={{ flex: 1 }}>
      <Header
        title="Sell NFT"
        left={<Icon icon={'close'} />}
        onPressLeft={navigation.goBack}
      />
      {selectedNftList.length > 0 && (
        <Contents selectedNft={selectedNftList[0]} />
      )}
    </Container>
  )
}

export default SellNftScreentsx

const styles = StyleSheet.create({
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
