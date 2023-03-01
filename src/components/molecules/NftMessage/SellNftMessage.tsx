import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormButton from 'components/atoms/FormButton'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import { pToken, QueryKeyEnum, SbSellNftDataType } from 'types'
import { fetchNftImage } from 'libs/fetchTokenUri'
import useZxOrder from 'hooks/zx/useZxOrder'
import useEthPrice from 'hooks/independent/useEthPrice'
import useReactQuery from 'hooks/complex/useReactQuery'

import MediaRenderer from '../../atoms/MediaRenderer'
import Row from '../../atoms/Row'

const SellNftMessage = ({
  data,
}: {
  data: SbSellNftDataType
}): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft
  const { data: uri } = useReactQuery(
    [QueryKeyEnum.MORALIS_NFT_IMAGE, item.token_address, item.token_id],
    () => fetchNftImage({ metadata: item.metadata, tokenUri: item.token_uri })
  )
  const { order } = useZxOrder({ nonce: data.nonce })
  const { getEthPrice } = useEthPrice()

  return (
    <View style={styles.container}>
      <MediaRenderer src={uri} width={'100%'} height={150} />
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
        {order && (
          <View style={styles.priceBox}>
            <Row style={styles.priceRow}>
              <Text>ETH</Text>
              <Text
                style={{
                  color: COLOR.primary._400,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {UTIL.formatAmountP(
                  (order.order.erc20TokenAmount || '0') as pToken
                )}
              </Text>
            </Row>
            <Row style={styles.priceRow}>
              <Text>Price</Text>
              <Text style={{ fontSize: 12 }}>
                $
                {UTIL.formatAmountP(
                  getEthPrice(order.order.erc20TokenAmount || ('0' as pToken)),
                  { toFix: 0 }
                )}
              </Text>
            </Row>
          </View>
        )}
        <FormButton
          size="sm"
          onPress={(): void => {
            order
              ? navigation.navigate(Routes.ZxNftDetail, { nonce: data.nonce })
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
