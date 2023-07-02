import FormText from 'components/atoms/FormText'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import MoralisNftRenderer from 'components/moralis/MoralisNftRenderer'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Routes } from 'palm-core/libs/navigation'
import { SbShareNftDataType, SupportedNetworkEnum } from 'palm-core/types'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

const ShareNftMessage = ({
  data,
}: {
  data: SbShareNftDataType
}): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft

  const chain: SupportedNetworkEnum =
    UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  return (
    <TouchableWithoutFeedback
      onPress={(): void => {
        navigation.push(Routes.NftDetail, {
          nftContract: item.token_address,
          tokenId: item.token_id,
          nftContractType: item.contract_type,
          chain,
          item,
        })
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <FormText font={'B'} style={{ color: COLOR.primary._400 }}>{`${
            item.name
          } #${UTIL.truncate(item.token_id)}`}</FormText>
        </View>
        <VerifiedWrapper>
          <MoralisNftRenderer
            item={item}
            width={'100%'}
            height={150}
            style={{
              borderRadius: 18,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              maxWidth: 'auto',
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
