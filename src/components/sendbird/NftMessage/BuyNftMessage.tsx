import FormButton from 'components/atoms/FormButton'
import FormText from 'components/atoms/FormText'
import UserMention from 'components/atoms/UserMention'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import { COLOR, UTIL } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import useNft from 'hooks/contract/useNft'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  ContractAddr,
  NftType,
  SbBuyNftDataType,
  SupportedNetworkEnum,
} from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'

import NftSoldTag from './NftSoldTag'

const BuyNftMessage = ({ data }: { data: SbBuyNftDataType }): ReactElement => {
  const { navigation } = useAppNavigation()
  const { t } = useTranslation()

  const item = data.selectedNft
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { getLink } = useExplorer(chain)

  const { name } = useNft({
    nftContract: item.nftToken as ContractAddr,
    chain,
  })

  const [nftName, setNftName] = useState<string>()

  const nftRendererProps: NftRendererProp = {
    nftContract: item.nftToken as ContractAddr,
    tokenId: item.nftTokenId,
    type: item.nftType as NftType,
    chain,
    width: '100%',
    height: 150,
  }

  useAsyncEffect(async () => {
    const _nftName = await name()
    setNftName(_nftName)
  }, [item])

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <NftSoldTag position="left" style={{ margin: 10 }} />
        <VerifiedWrapper>
          <NftRenderer {...nftRendererProps} style={{ maxWidth: 'auto' }} />
        </VerifiedWrapper>
        <FormText
          style={{
            color: 'black',
            padding: 10,
          }}
        >
          <UserMention userMetadata={data.buyer} />
          <FormText>{t('Components.BuyNftMessage.BoughtNftBought')}</FormText>
          <FormText font={'B'} style={{ color: COLOR.primary._400 }}>
            {t('Components.BuyNftMessage.BoughtNftBoughtNft', {
              nftName: nftName ?? UTIL.truncate(item.nftToken),
              nftTokenId: item.nftTokenId,
              type: item.nftType,
            })}
          </FormText>
          {data.price && (
            <>
              <FormText>
                {t('Components.BuyNftMessage.BoughtNftBoughtFor')}
              </FormText>
              <FormText font={'B'}>
                {t('Components.BuyNftMessage.BoughtNftBoughtPrice', {
                  tokenName: data.price.tokenName,
                  amount: data.price.amount,
                })}
              </FormText>
            </>
          )}
          <FormText>
            {t('Components.BuyNftMessage.BoughtNftBoughtFrom')}
          </FormText>
          <UserMention userMetadata={data.from} />
        </FormText>

        <FormButton
          size="sm"
          containerStyle={{ margin: 16, marginTop: 0 }}
          onPress={(): void => {
            navigation.push(Routes.NftDetail, {
              nftContract: item.nftToken as ContractAddr,
              nftContractType: item.nftType as NftType,
              tokenId: UTIL.truncate(item.nftTokenId),
              chain,
            })
          }}
        >
          {t('Common.Details')}
        </FormButton>
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
              address: item.nftToken,
              type: 'nft',
              tokenId: item.nftTokenId,
            })
          )
        }}
      >
        <FormText color={COLOR.black._500}>
          {t('Components.BuyNftMessage.ViewTransactionDetail')}
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

export default BuyNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: {
    paddingTop: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: COLOR.black._90010,
    borderRadius: 18,
  },
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
