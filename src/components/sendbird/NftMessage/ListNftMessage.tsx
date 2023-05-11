import { Row } from 'components'
import FormButton from 'components/atoms/FormButton'
import FormImage from 'components/atoms/FormImage'
import FormText from 'components/atoms/FormText'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import { COLOR, NETWORK, UTIL } from 'consts'
import { format } from 'date-fns'
import useExplorer from 'hooks/complex/useExplorer'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useMaticPrice from 'hooks/independent/useMaticPrice'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useZxOrder from 'hooks/zx/useZxOrder'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pToken, SbListNftDataType, SupportedNetworkEnum } from 'types'

const KlayPrice = ({ amount }: { amount: pToken }): ReactElement => {
  const { getKlayPrice } = useKlayPrice()

  return (
    <FormText fontType="R.10" color={COLOR.black._400}>
      {`(≈$${UTIL.formatAmountP(getKlayPrice(amount || ('0' as pToken)), {
        toFix: 0,
      })})`}
    </FormText>
  )
}
const MaticPrice = ({ amount }: { amount: pToken }): ReactElement => {
  const { getMaticPrice } = useMaticPrice()

  return (
    <FormText fontType="R.10" color={COLOR.black._400}>
      {`(≈$${UTIL.formatAmountP(getMaticPrice(amount || ('0' as pToken)), {
        toFix: 0,
      })})`}
    </FormText>
  )
}
const EthPrice = ({ amount }: { amount: pToken }): ReactElement => {
  const { getEthPrice } = useEthPrice()

  return (
    <FormText fontType="R.10" color={COLOR.black._400}>
      {`(≈$${UTIL.formatAmountP(getEthPrice(amount || ('0' as pToken)), {
        toFix: 0,
      })})`}
    </FormText>
  )
}

const ListNftMessage = ({
  data,
}: {
  data: SbListNftDataType
}): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const item = data.selectedNft

  const chain =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { order, isLoading } = useZxOrder({ nonce: data.nonce, chain })

  const nftRendererProps: NftRendererProp = {
    nftContract: item.token_address,
    tokenId: item.token_id,
    type: item.contract_type,
    metadata: item.metadata,
    chain,
    width: '100%',
    height: 150,
  }

  const { getLink } = useExplorer(chain)

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Row style={{ paddingVertical: 9, paddingHorizontal: 12 }}>
          <FormText fontType="B.10">{`${item.name} #${item.token_id}`}</FormText>
        </Row>
        <View style={{ position: 'relative' }}>
          <VerifiedWrapper>
            <NftRenderer {...nftRendererProps} style={{ maxWidth: 'auto' }} />
          </VerifiedWrapper>
          {isLoading === false && (
            <>
              {order ? (
                <Row
                  style={[
                    styles.floatRightLabel,
                    {
                      backgroundColor: COLOR.primary._100,
                      alignItems: 'center',
                      columnGap: 4,
                    },
                  ]}
                >
                  <Ionicons
                    name="ios-time-outline"
                    color={COLOR.primary._400}
                    size={14}
                  />
                  <FormText fontType="SB.12" color={COLOR.primary._400}>
                    {format(
                      new Date(_.toNumber(order.order.expiry) * 1000),
                      'yyyy-MM-dd'
                    )}
                  </FormText>
                </Row>
              ) : (
                <View
                  style={[
                    styles.floatRightLabel,
                    {
                      backgroundColor: COLOR.error,
                    },
                  ]}
                >
                  <FormText fontType="SB.12" color="white">
                    Sold
                  </FormText>
                </View>
              )}
            </>
          )}
        </View>
        <View style={{ padding: 16 }}>
          <View style={styles.priceBox}>
            <Row style={styles.priceRow}>
              <FormImage source={NETWORK.getNetworkLogo(chain)} size={18} />
              <FormText fontType="B.18">
                {UTIL.formatAmountP((data.amount || '0') as pToken)}
              </FormText>
            </Row>
            <Row style={styles.priceRow}>
              {chain === SupportedNetworkEnum.ETHEREUM && (
                <EthPrice amount={data.amount} />
              )}
              {chain === SupportedNetworkEnum.KLAYTN && (
                <KlayPrice amount={data.amount} />
              )}
              {chain === SupportedNetworkEnum.POLYGON && (
                <MaticPrice amount={data.amount} />
              )}
            </Row>
          </View>

          <FormButton
            size="sm"
            onPress={(): void => {
              order
                ? navigation.navigate(Routes.ZxNftDetail, {
                    nonce: data.nonce,
                    channelUrl: params.channelUrl,
                    chain:
                      chainIdToSupportedNetworkEnum(
                        item.chainId || data.selectedNft.chainId || '0x1'
                      ) || SupportedNetworkEnum.ETHEREUM,
                    item,
                  })
                : navigation.navigate(Routes.NftDetail, {
                    nftContract: item.token_address,
                    tokenId: item.token_id,
                    nftContractType: item.contract_type,
                    chain,
                    item,
                  })
            }}
          >
            Details
          </FormButton>
        </View>
      </View>

      <TouchableOpacity
        style={{
          alignSelf: 'flex-end',
          paddingTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={(): void => {
          Linking.openURL(
            getLink({
              address: item.token_address,
              type: 'nft',
              tokenId: item.token_id,
            })
          )
        }}
      >
        <FormText color={COLOR.black._500} fontType="R.12">
          View Transaction Detail{' '}
        </FormText>
        <Ionicons
          color={COLOR.black._500}
          name="ios-chevron-forward"
          size={14}
        />
      </TouchableOpacity>
    </View>
  )
}

export default ListNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { borderWidth: 1, borderColor: COLOR.black._90010, borderRadius: 18 },
  priceBox: {
    rowGap: 5,
    borderRadius: 10,
    paddingBottom: 20,
  },
  priceRow: {
    alignItems: 'center',
    columnGap: 4,
  },
  floatRightLabel: {
    position: 'absolute',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    right: 0,
  },
})
