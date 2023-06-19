import FormButton from 'components/atoms/FormButton'
import FormText from 'components/atoms/FormText'
import UserMention from 'components/atoms/UserMention'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'
import { COLOR, UTIL } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import useNft from 'hooks/contract/useNft'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement, useState } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  ContractAddr,
  NftType,
  SbBuyNftDataType,
  SupportedNetworkEnum,
} from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'

const BuyNftMessage = ({ data }: { data: SbBuyNftDataType }): ReactElement => {
  const { navigation } = useAppNavigation()

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
      <NftRenderer {...nftRendererProps} style={{ maxWidth: 'auto' }} />
      <View style={styles.body}>
        <FormText style={{ color: COLOR.primary._400 }}>Bought NFT</FormText>

        <FormText
          fontType="R.12"
          numberOfLines={2}
          style={{
            color: 'black',
          }}
        >
          <UserMention userMetadata={data.buyer} />
          <FormText fontType="B.12">{` bought ${
            nftName ?? UTIL.truncate(item.nftToken)
          } #${item.nftTokenId} from `}</FormText>
          <UserMention userMetadata={data.from} />
        </FormText>

        <FormButton
          size="sm"
          onPress={(): void => {
            navigation.navigate(Routes.NftDetail, {
              nftContract: item.nftToken as ContractAddr,
              nftContractType: item.nftType as NftType,
              tokenId: item.nftTokenId,
              chain,
            })
          }}
        >
          Details
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
