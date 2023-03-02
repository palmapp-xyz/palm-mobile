import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormButton from 'components/atoms/FormButton'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import { pToken, SbSellNftDataType } from 'types'
import useZxOrder from 'hooks/zx/useZxOrder'
import useEthPrice from 'hooks/independent/useEthPrice'
import useNftImage from 'hooks/independent/useNftImage'

import MediaRenderer from '../../atoms/MediaRenderer'
import Row from '../../atoms/Row'

const SellNftMessage = ({
  data,
}: {
  data: SbSellNftDataType
}): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const item = data.selectedNft
  const { uri } = useNftImage({
    nftContract: item.token_address,
    tokenId: item.token_id,
    metadata: item.metadata,
  })

  const { order } = useZxOrder({ nonce: data.nonce })
  const { getEthPrice } = useEthPrice()

  return (
    <View style={styles.container}>
      <MediaRenderer src={uri} width={'100%'} height={150} />
      {!order && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLOR.error,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
            margin: 5,
            right: 0,
          }}>
          <Text style={{ color: 'white' }}>Sold</Text>
        </View>
      )}
      <View style={styles.body}>
        <Row style={{ alignItems: 'center', columnGap: 5 }}>
          <Icon
            name="ios-shield-checkmark"
            color={COLOR.primary._400}
            size={20}
          />
          <Text
            numberOfLines={2}
            style={{ color: 'black' }}>{`${item.name} #${item.token_id}`}</Text>
        </Row>
        <View style={styles.priceBox}>
          <Row style={styles.priceRow}>
            <Text>ETH</Text>
            <Text
              style={{
                color: COLOR.primary._400,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {UTIL.formatAmountP((data.ethAmount || '0') as pToken)}
            </Text>
          </Row>
          <Row style={styles.priceRow}>
            <Text>Price</Text>
            <Text style={{ fontSize: 12 }}>
              $
              {UTIL.formatAmountP(
                getEthPrice(data.ethAmount || ('0' as pToken)),
                { toFix: 0 }
              )}
            </Text>
          </Row>
        </View>
        <FormButton
          size="sm"
          onPress={(): void => {
            order
              ? navigation.navigate(Routes.ZxNftDetail, {
                  nonce: data.nonce,
                  channelUrl: params.channelUrl,
                })
              : navigation.navigate(Routes.NftDetail, {
                  nftContract: item.token_address,
                  tokenId: item.token_id,
                })
          }}>
          Details
        </FormButton>
      </View>
    </View>
  )
}

export default SellNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { padding: 10, gap: 10 },
  priceBox: {
    backgroundColor: COLOR.primary._50,
    padding: 10,
    rowGap: 5,
    borderRadius: 10,
  },
  priceRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
