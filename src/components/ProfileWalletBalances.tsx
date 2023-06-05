import images from 'assets/images'
import { FormImage, FormText, Row } from 'components'
import { COLOR, UTIL } from 'consts'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useMaticPrice from 'hooks/independent/useMaticPrice'
import useUserBalance from 'hooks/independent/useUserBalance'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, SupportedNetworkEnum, pToken } from 'types'

export type ProfileWalletBalancesProps = {
  userAddress: ContractAddr | undefined
  onToggleShowUserTokensSheet?: () => void
}

const ProfileWalletBalances = React.memo(
  ({
    userAddress,
    onToggleShowUserTokensSheet,
  }: ProfileWalletBalancesProps): ReactElement => {
    const { getEthPrice } = useEthPrice()
    const { getKlayPrice } = useKlayPrice()
    const { getMaticPrice } = useMaticPrice()

    const { balance: ethBalance } = useUserBalance({
      address: userAddress,
      chain: SupportedNetworkEnum.ETHEREUM,
    })
    const { balance: klayBalance } = useUserBalance({
      address: userAddress,
      chain: SupportedNetworkEnum.KLAYTN,
    })
    const { balance: maticBalance } = useUserBalance({
      address: userAddress,
      chain: SupportedNetworkEnum.POLYGON,
    })

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
            <FormText fontType="B.14">Wallet Balances</FormText>
            <FormText fontType="R.10" color={COLOR.black._200}>
              Only visible to you
            </FormText>
          </Row>

          <View style={{ rowGap: 8 }}>
            <View style={styles.itemCard}>
              <Row style={{ alignItems: 'center', columnGap: 12 }}>
                <FormImage source={images.eth_logo} size={28} />
                <View>
                  <Row>
                    <FormText fontType="B.16">
                      {UTIL.formatAmountP(ethBalance || ('0' as pToken), {
                        toFix: 4,
                      })}{' '}
                    </FormText>
                    <FormText fontType="R.16">ETH</FormText>
                  </Row>
                  <FormText fontType="R.10" color={COLOR.black._400}>
                    {`(≈ $${UTIL.formatAmountP(
                      getEthPrice(ethBalance || ('0' as pToken)),
                      {
                        toFix: 0,
                      }
                    )})`}
                  </FormText>
                </View>
              </Row>
            </View>

            <View style={styles.itemCard}>
              <Row style={{ alignItems: 'center', columnGap: 12 }}>
                <FormImage source={images.klay_logo} size={28} />
                <View>
                  <Row>
                    <FormText fontType="B.16">
                      {UTIL.formatAmountP(klayBalance || ('0' as pToken), {
                        toFix: 4,
                      })}{' '}
                    </FormText>
                    <FormText fontType="R.16">KLAY</FormText>
                  </Row>
                  <FormText fontType="R.10" color={COLOR.black._400}>
                    {`(≈ $${UTIL.formatAmountP(
                      getKlayPrice(klayBalance || ('0' as pToken)),
                      {
                        toFix: 0,
                      }
                    )})`}
                  </FormText>
                </View>
              </Row>
            </View>

            <View style={styles.itemCard}>
              <Row style={{ alignItems: 'center', columnGap: 12 }}>
                <FormImage source={images.matic_logo} size={28} />
                <View>
                  <Row>
                    <FormText fontType="B.16">
                      {UTIL.formatAmountP(maticBalance || ('0' as pToken), {
                        toFix: 4,
                      })}{' '}
                    </FormText>
                    <FormText fontType="R.16">MATIC</FormText>
                  </Row>
                  <FormText fontType="R.10" color={COLOR.black._400}>
                    {`(≈ ${UTIL.formatAmountP(
                      getMaticPrice(maticBalance || ('0' as pToken)),
                      {
                        toFix: 0,
                      }
                    )})`}
                  </FormText>
                </View>
              </Row>
            </View>
          </View>

          <TouchableOpacity onPress={onToggleShowUserTokensSheet}>
            <Row style={styles.seeAll}>
              <FormText fontType="R.14" color={COLOR.black._400}>
                See All
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
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
  seeAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    gap: 2,
  },
})
