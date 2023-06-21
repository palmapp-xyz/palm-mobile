import { FormText, Row } from 'components'
import { COLOR } from 'consts'
import useNativeToken from 'hooks/independent/useNativeToken'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, Moralis, SupportedNetworkEnum, pToken } from 'types'

import { useTranslation } from 'react-i18next'
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
            <FormText fontType="B.14">
              {t('Components.ProfileWalletBalances.WalletBalances')}
            </FormText>
            <FormText fontType="R.12" color={COLOR.black._200}>
              {t('Components.ProfileWalletBalances.OnlyVisibleToYou')}
            </FormText>
          </Row>

          <View style={{ rowGap: 8 }}>
            {tokens.map((item: Moralis.FtItem | undefined) => {
              if (!item) {
                return null
              }
              return (
                <MoralisErc20Token item={item} value={item.balance as pToken} />
              )
            })}
          </View>

          <TouchableOpacity onPress={onToggleShowUserTokensSheet}>
            <Row style={styles.seeAll}>
              <FormText fontType="R.14" color={COLOR.black._400}>
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
