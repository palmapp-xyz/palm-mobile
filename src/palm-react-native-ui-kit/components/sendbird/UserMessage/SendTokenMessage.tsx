import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { SbSendTokenDataType, SupportedNetworkEnum } from 'palm-core/types'
import FormText from 'palm-react-native-ui-kit/components/atoms/FormText'
import UserMention from 'palm-react-native-ui-kit/components/atoms/UserMention'
import MoralisErc20Token from 'palm-react-native-ui-kit/components/MoralisErc20Token'
import useExplorer from 'palm-react/hooks/complex/useExplorer'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const SendTokenMessage = ({
  data,
}: {
  data: SbSendTokenDataType
}): ReactElement => {
  const { t } = useTranslation()
  const item = data.selectedToken

  const chain =
    UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { getLink } = useExplorer(chain)

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <FormText
          style={{
            color: 'black',
            paddingVertical: 9,
            paddingHorizontal: 12,
          }}
        >
          <FormText font="B">{t('Components.SendTokenMessage.Sent')}</FormText>
          {t('Components.SendTokenMessage.To')}
          <UserMention userMetadata={data.to} />
        </FormText>

        <MoralisErc20Token
          item={item}
          value={data.value}
          style={{ marginBottom: 0 }}
        />
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
              address: data.txHash,
              type: 'tx',
            })
          )
        }}
      >
        <FormText color={COLOR.black._500}>
          {t('Components.SendTokenMessage.ViewTransactionDetail')}
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
