import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormButton from 'components/atoms/FormButton'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import { COLOR, UTIL } from 'consts'

import { SbBuyNftDataType } from 'types'

import MediaRenderer from '../../atoms/MediaRenderer'
import useNftImage from 'hooks/independent/useNftImage'
import EthLogoWrapper from '../../molecules/EthLogoWrapper'

const BuyNftMessage = ({ data }: { data: SbBuyNftDataType }): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft
  const { uri } = useNftImage({
    nftContract: item.nftToken,
    tokenId: item.nftTokenId,
  })

  return (
    <View style={styles.container}>
      <EthLogoWrapper>
        <MediaRenderer src={uri} width={'100%'} height={150} />
      </EthLogoWrapper>
      <View style={styles.body}>
        <Text style={{ color: COLOR.primary._400 }}>Buy NFT</Text>
        <Text
          numberOfLines={2}
          style={{
            color: 'black',
          }}>{`${UTIL.truncate(data.buyer)} bought #${item.nftTokenId}`}</Text>

        <FormButton
          size="sm"
          onPress={(): void => {
            navigation.navigate(Routes.NftDetail, {
              nftContract: item.nftToken,
              tokenId: item.nftTokenId,
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
