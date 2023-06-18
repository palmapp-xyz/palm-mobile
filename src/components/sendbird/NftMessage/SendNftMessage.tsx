import FormText from 'components/atoms/FormText'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import MoralisNftRenderer from 'components/moralis/MoralisNftRenderer'
import { COLOR, UTIL } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SbSendNftDataType, SupportedNetworkEnum } from 'types'

import { useTranslation } from 'react-i18next'
import Row from '../../atoms/Row'

const SendNftMessage = ({
  data,
}: {
  data: SbSendNftDataType
}): ReactElement => {
  const { navigation } = useAppNavigation()
  const { t } = useTranslation()

  const item = data.selectedNft

  const chain =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { getLink } = useExplorer(chain)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.body}
        onPress={(): void => {
          navigation.navigate(Routes.NftDetail, {
            nftContract: item.token_address,
            tokenId: item.token_id,
            nftContractType: item.contract_type,
            chain,
            item,
          })
        }}
      >
        <Row style={{ paddingVertical: 9, paddingHorizontal: 12 }}>
          <FormText fontType="B.14">{t('Nft.SendNftMessageSent')}</FormText>
          <FormText fontType="R.14">
            {t('Nft.SendNftMessageTo', { to: UTIL.truncate(data.to) })}
          </FormText>
        </Row>
        <VerifiedWrapper>
          <MoralisNftRenderer
            item={item}
            width={'100%'}
            height={232}
            style={{
              borderRadius: 18,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              maxWidth: 'auto',
            }}
          />
        </VerifiedWrapper>
      </TouchableOpacity>
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
        <FormText color={COLOR.black._500} fontType="R.14">
          {t('Nft.SendNftMessageViewTransactionDetail')}
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

export default SendNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { borderWidth: 1, borderColor: COLOR.black._90010, borderRadius: 18 },
})
