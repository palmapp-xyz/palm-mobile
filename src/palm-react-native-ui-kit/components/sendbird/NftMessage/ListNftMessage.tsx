import { format } from 'date-fns'
import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Routes } from 'palm-core/libs/navigation'
import {
  pToken,
  SbListNftDataType,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { MoralisNftRenderer, Row } from 'palm-react-native-ui-kit/components'
import FormButton from 'palm-react-native-ui-kit/components/atoms/FormButton'
import FormImage from 'palm-react-native-ui-kit/components/atoms/FormImage'
import FormText from 'palm-react-native-ui-kit/components/atoms/FormText'
import VerifiedWrapper from 'palm-react-native-ui-kit/components/molecules/VerifiedWrapper'
import { useAppNavigation } from 'palm-react/hooks/app/useAppNavigation'
import useExplorer from 'palm-react/hooks/complex/useExplorer'
import useFsListing from 'palm-react/hooks/firestore/useFsListing'
import useEthPrice from 'palm-react/hooks/independent/useEthPrice'
import useKlayPrice from 'palm-react/hooks/independent/useKlayPrice'
import useMaticPrice from 'palm-react/hooks/independent/useMaticPrice'
import useZxOrder from 'palm-react/hooks/zx/useZxOrder'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NftSoldTag from './NftSoldTag'

const KlayPrice = ({ amount }: { amount: pToken }): ReactElement => {
  const { getKlayPrice } = useKlayPrice()
  const { t } = useTranslation()

  return (
    <FormText color={COLOR.black._400}>
      {t('Common.UsdPrice', {
        price: UTIL.formatAmountP(getKlayPrice(amount || ('0' as pToken)), {
          toFix: 2,
        }),
      })}
    </FormText>
  )
}
const MaticPrice = ({ amount }: { amount: pToken }): ReactElement => {
  const { getMaticPrice } = useMaticPrice()
  const { t } = useTranslation()

  return (
    <FormText color={COLOR.black._400}>
      {t('Common.UsdPrice', {
        price: UTIL.formatAmountP(getMaticPrice(amount || ('0' as pToken)), {
          toFix: 2,
        }),
      })}
    </FormText>
  )
}
const EthPrice = ({ amount }: { amount: pToken }): ReactElement => {
  const { getEthPrice } = useEthPrice()
  const { t } = useTranslation()

  return (
    <FormText color={COLOR.black._400}>
      {t('Common.UsdPrice', {
        price: UTIL.formatAmountP(getEthPrice(amount || ('0' as pToken)), {
          toFix: 2,
        }),
      })}
    </FormText>
  )
}

const ListNftMessage = ({
  data,
}: {
  data: SbListNftDataType
}): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()
  const { t } = useTranslation()

  const item = data.selectedNft

  const chain =
    UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { order } = useZxOrder({ nonce: data.nonce, chain })
  const { fsListingField } = useFsListing({ nonce: data.nonce })

  const { getLink } = useExplorer(chain)

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <FormText style={{ paddingVertical: 9, paddingHorizontal: 12 }}>
          {'For sale: '}
          <FormText font={'B'} style={{ color: COLOR.primary._400 }}>{`${
            item.name
          } #${UTIL.truncate(item.token_id)}`}</FormText>
        </FormText>
        <View style={{ position: 'relative' }}>
          <VerifiedWrapper>
            <MoralisNftRenderer
              item={item}
              width={'100%'}
              height={150}
              style={{
                maxWidth: 'auto',
              }}
            />
          </VerifiedWrapper>
          {order && fsListingField && (
            <>
              {fsListingField.status === 'active' ? (
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
                  <FormText font={'SB'} color={COLOR.primary._400}>
                    {format(
                      new Date(_.toNumber(order.order.expiry) * 1000),
                      'yyyy-MM-dd'
                    )}
                  </FormText>
                </Row>
              ) : (
                <NftSoldTag />
              )}
            </>
          )}
        </View>
        <View style={{ padding: 16 }}>
          <View style={styles.priceBox}>
            <Row style={styles.priceRow}>
              <FormImage source={UTIL.getNetworkLogo(chain)} size={18} />
              <FormText font={'B'} size={18}>
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
              fsListingField?.status === 'active'
                ? navigation.push(Routes.ZxNftDetail, {
                    nonce: data.nonce,
                    channelUrl: params.channelUrl,
                    chain:
                      UTIL.chainIdToSupportedNetworkEnum(
                        item.chainId || data.selectedNft.chainId || '0x1'
                      ) || SupportedNetworkEnum.ETHEREUM,
                    item,
                  })
                : navigation.push(Routes.NftDetail, {
                    nftContract: item.token_address,
                    tokenId: item.token_id,
                    nftContractType: item.contract_type,
                    chain,
                    item,
                  })
            }}
          >
            {t('Nft.ListNftMessageDetails')}
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
        <FormText color={COLOR.black._500}>
          {t('Nft.ListNftMessageViewTransactionDetail')}
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
