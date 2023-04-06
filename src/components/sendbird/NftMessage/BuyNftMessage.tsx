import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormButton from 'components/atoms/FormButton'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import { COLOR, UTIL } from 'consts'

import {
  ContractAddr,
  NftType,
  SbBuyNftDataType,
  SupportedNetworkEnum,
} from 'types'

import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'

const BuyNftMessage = ({ data }: { data: SbBuyNftDataType }): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const nftRendererProps: NftRendererProp = {
    nftContract: item.nftToken as ContractAddr,
    tokenId: item.nftTokenId,
    type: item.nftType as NftType,
    chain,
    width: '100%',
    height: 150,
  }

  return (
    <View style={styles.container}>
      <NftRenderer {...nftRendererProps} />
      <View style={styles.body}>
        <Text style={{ color: COLOR.primary._400 }}>Bought NFT</Text>
        <Text
          numberOfLines={2}
          style={{
            color: 'black',
          }}>{`${UTIL.truncate(data.buyer)} bought #${item.nftTokenId}`}</Text>

        <FormButton
          size="sm"
          onPress={(): void => {
            navigation.navigate(Routes.NftDetail, {
              nftContract: item.nftToken as ContractAddr,
              nftContractType: item.nftType as NftType,
              tokenId: item.nftTokenId,
              chain,
            })
          }}>
          Details
        </FormButton>
      </View>
    </View>
  )
}

export default BuyNftMessage

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
