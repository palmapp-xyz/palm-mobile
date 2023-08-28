import { COLOR } from 'palm-core/consts'
import {
  ContractAddr,
  Moralis,
  pToken,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { FormText, Row } from 'palm-react-native-ui-kit/components'
import useNativeToken from 'palm-react/hooks/independent/useNativeToken'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

import Clipboard from '@react-native-clipboard/clipboard'
import { UTIL } from 'palm-core/libs'
import useToast from 'palm-react-native/app/useToast'
import MoralisErc20Token from './MoralisErc20Token'

export type ProfileWalletBalancesProps = {
  userAddress: ContractAddr | undefined
  onToggleShowUserTokensSheet?: () => void
}

const ProfileWalletBalances = React.memo(
  ({
    userAddress,
    onToggleShowUserTokensSheet,
  }: ProfileWalletBalancesProps): ReactElement => {
    const { t } = useTranslation()
    const toast = useToast()

    const { nativeToken: eth } = useNativeToken({
      userAddress,
      network: SupportedNetworkEnum.ETHEREUM,
    })
    const { nativeToken: klay } = useNativeToken({
      userAddress,
      network: SupportedNetworkEnum.KLAYTN,
    })
    const { nativeToken: matic } = useNativeToken({
      userAddress,
      network: SupportedNetworkEnum.POLYGON,
    })

    const tokens: (Moralis.FtItem | undefined)[] = [eth, klay, matic].filter(
      x => x !== undefined
    )

    return (
      <>
        <View style={styles.walletBalanceBox}>
          <Row
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 12,
            }}
          >
            <FormText font={'B'}>
              {t('Components.ProfileWalletBalances.MyWallet')}
            </FormText>
            {userAddress && (
              <TouchableOpacity
                style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
                onPress={(): void => {
                  toast.show(
                    t('Components.ProfileWalletAddress.AddressCopied'),
                    {
                      color: 'green',
                      icon: 'check',
                    }
                  )
                  Clipboard.setString(userAddress)
                }}
              >
                <FormText color={COLOR.black._500}>
                  {UTIL.truncate(userAddress.toString(), [6, 4])}
                </FormText>
                <Icon name="copy-outline" color={COLOR.black._500} size={14} />
              </TouchableOpacity>
            )}
          </Row>

          <View style={{ rowGap: 8 }}>
            {tokens.map((item: Moralis.FtItem | undefined) => {
              if (!item) {
                return null
              }
              return (
                <MoralisErc20Token
                  key={`${item.token_address}:${item.chainId}}`}
                  item={item}
                  value={item.balance as pToken}
                />
              )
            })}
          </View>

          <TouchableOpacity onPress={onToggleShowUserTokensSheet}>
            <Row style={styles.seeAll}>
              <FormText color={COLOR.black._400}>
                {t('Components.ProfileWalletBalances.SeeAll')}
              </FormText>
              <Icon
                name="ios-chevron-forward"
                color={COLOR.black._300}
                size={16}
              />
            </Row>
          </TouchableOpacity>
        </View>
      </>
    )
  }
)

export default ProfileWalletBalances

const styles = StyleSheet.create({
  walletBalanceBox: { paddingTop: 24 },
  seeAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    gap: 2,
  },
})
