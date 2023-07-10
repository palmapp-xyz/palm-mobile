import { COLOR, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Routes } from 'palm-core/libs/navigation'
import { Moralis, SupportedNetworkEnum, Token } from 'palm-core/types'
import {
  FormButton,
  FormImage,
  FormInput,
  FormText,
  Row,
} from 'palm-react-native-ui-kit/components'
import NftCard from 'palm-react-native-ui-kit/components/channel/NftCard'
import NativeTokenUSD from 'palm-react-native-ui-kit/components/molecules/NativeTokenUSD'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import useFormattedValue from 'palm-react/hooks/util/useFormattedNumber'
import { UseZxListNftReturn } from 'palm-react/hooks/zx/useZxListNft'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Contents = ({
  selectedNft,
  chain,
  setShowBottomSheet,
  useZxListNftReturn,
}: {
  selectedNft: Moralis.NftItem
  chain: SupportedNetworkEnum
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
  useZxListNftReturn: UseZxListNftReturn
}): ReactElement => {
  const { price, setPrice, isApproved, onClickApprove } = useZxListNftReturn

  const { formattedValue, setValue: setUnformattedValue } = useFormattedValue(
    (unformattedValue: Token) => {
      setPrice(unformattedValue)
    }
  )

  const { navigation } = useAppNavigation<Routes.ListNft>()
  const toast = useToast()

  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding' })}
      style={{ flex: 1 }}
      keyboardVerticalOffset={bottom}
    >
      <View style={styles.body}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ rowGap: 8, paddingBottom: 28 }}>
            <FormText font={'B'}>{t('Nft.ListNftWantToSellThisNft')}</FormText>
            {isApproved && (
              <>
                <Row
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <FormInput
                    font={'B'}
                    size={24}
                    placeholder={t('Nft.ListNftPricePlaceholder')}
                    value={formattedValue}
                    onChangeText={(value): void => {
                      setUnformattedValue(value as Token)
                    }}
                    inputMode={'decimal'}
                    style={{
                      borderWidth: 0,
                      borderRadius: 0,
                      padding: 0,
                      paddingLeft: 0,
                      height: 48,
                      flex: 1,
                    }}
                  />
                  <Row
                    style={{
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: COLOR.black._90005,
                      padding: 8,
                      borderRadius: 12,
                    }}
                  >
                    <FormImage source={UTIL.getNetworkLogo(chain)} size={20} />
                    <FormText font={'B'} size={20}>
                      {NETWORK.nativeToken[chain]}
                    </FormText>
                  </Row>
                </Row>
                <NativeTokenUSD amount={UTIL.microfyP(price)} network={chain} />
              </>
            )}
          </View>
          <NftCard selectedNft={selectedNft} />
        </View>
        <View>
          {isApproved ? (
            <View style={styles.footer}>
              <FormButton
                disabled={!UTIL.isValidPrice(price)}
                onPress={async (): Promise<void> => {
                  Keyboard.dismiss()
                  setShowBottomSheet(true)
                }}
              >
                {t('Nft.ListNftList')}
              </FormButton>
            </View>
          ) : (
            <View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <FormText style={{ fontWeight: 'bold' }}>
                  {t('Nft.ListNftApproveToList')}
                </FormText>
              </View>
              <View style={styles.footer}>
                <FormButton
                  onPress={(): void => {
                    Keyboard.dismiss()
                    navigation.navigate(Routes.Pin, {
                      type: 'auth',
                      result: async (result: boolean): Promise<void> => {
                        if (result) {
                          navigation.pop()
                          onClickApprove()
                        } else {
                          toast.show(t('Nft.PinMismatchToast'), {
                            color: 'red',
                            icon: 'info',
                          })
                        }
                      },
                      cancel: (): void => {
                        navigation.pop()
                      },
                    })
                  }}
                >
                  {t('Common.Approve')}
                </FormButton>
              </View>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Contents

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
