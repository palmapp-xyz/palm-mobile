import FormText from 'components/atoms/FormText'
import UserMention from 'components/atoms/UserMention'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import MoralisErc20Token from 'components/MoralisErc20Token'
import { COLOR, UTIL } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pToken, SbSendTokenDataType, SupportedNetworkEnum } from 'types'

const SendTokenMessage = ({
  data,
}: {
  data: SbSendTokenDataType
}): ReactElement => {
  const item = data.selectedToken

  const chain =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { getLink } = useExplorer(chain)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.body}
        onPress={(): void => {
          Linking.openURL(
            getLink({
              address: data.txHash,
              type: 'tx',
            })
          )
        }}
      >
        <FormText
          fontType="R.12"
          numberOfLines={2}
          style={{
            color: 'black',
            paddingVertical: 9,
            paddingHorizontal: 12,
          }}
        >
          <UserMention userMetadata={data.from} />
          <FormText fontType="B.12">{` sent ${UTIL.formatAmountP(
            data.value as pToken,
            { toFix: 2 }
          )} ${data.selectedToken.symbol}`}</FormText>
          {' to '}
          <UserMention userMetadata={data.to} />
        </FormText>

        <VerifiedWrapper>
          <MoralisErc20Token item={item} value={data.value} />
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
              address: data.txHash,
              type: 'tx',
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

export default SendTokenMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { borderWidth: 1, borderColor: COLOR.black._90010, borderRadius: 18 },
})
