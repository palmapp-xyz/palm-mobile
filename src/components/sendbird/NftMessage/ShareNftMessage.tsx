import FormText from 'components/atoms/FormText'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { SbShareNftDataType, SupportedNetworkEnum } from 'types'

const ShareNftMessage = ({
  data,
}: {
  data: SbShareNftDataType
}): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft

  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const nftRendererProps: NftRendererProp = {
    nftContract: item.token_address,
    tokenId: item.token_id,
    type: item.contract_type,
    metadata: item.metadata,
    chain,
    width: '100%',
    height: 150,
    style: { borderRadius: 10 },
  }

  return (
    <TouchableWithoutFeedback
      onPress={(): void => {
        navigation.navigate(Routes.NftDetail, {
          nftContract: item.token_address,
          tokenId: item.token_id,
          nftContractType: item.contract_type,
          chain,
        })
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <FormText
            numberOfLines={1}
            fontType="B.10"
          >{`${item.name} #${item.token_id}`}</FormText>
        </View>
        <VerifiedWrapper>
          <NftRenderer
            {...nftRendererProps}
            style={{
              borderRadius: 18,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
        </VerifiedWrapper>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ShareNftMessage

const styles = StyleSheet.create({
  container: {
    width: 230,
    borderRadius: 18,
    borderColor: COLOR.black._90010,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  header: { paddingVertical: 10, paddingHorizontal: 12 },
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
