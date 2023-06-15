import { FormButton, FormImage, FormInput, FormText, Row } from 'components'
import NftCard from 'components/channel/NftCard'
import { COLOR, NETWORK } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { UseZxListNftReturn } from 'hooks/zx/useZxListNft'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Moralis, SupportedNetworkEnum, Token } from 'types'

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

  const { navigation } = useAppNavigation<Routes.ListNft>()
  const toast = useToast()

  const { bottom } = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding' })}
      style={{ flex: 1 }}
      keyboardVerticalOffset={bottom}
    >
      <View style={styles.body}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ rowGap: 8, paddingBottom: 28 }}>
            <FormText fontType="B.14">I want to sell this NFT for</FormText>
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormInput
                fontType="B.24"
                placeholder="Price"
                maxLength={10}
                value={price}
                onChangeText={(value): void => {
                  setPrice(value as Token)
                }}
                inputMode={'numeric'}
                style={{
                  borderWidth: 0,
                  borderRadius: 0,
                  padding: 0,
                  paddingLeft: 0,
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
                <FormImage source={NETWORK.getNetworkLogo(chain)} size={20} />
                <FormText fontType="B.20">
                  {NETWORK.nativeToken[chain]}
                </FormText>
              </Row>
            </Row>
          </View>
          <NftCard selectedNft={selectedNft} />
        </View>
        <View>
          {isApproved ? (
            <View style={styles.footer}>
              <FormButton
                disabled={!price}
                onPress={async (): Promise<void> => {
                  setShowBottomSheet(true)
                }}
              >
                List
              </FormButton>
            </View>
          ) : (
            <View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <FormText style={{ fontWeight: 'bold' }}>
                  Approve to list your NFT
                </FormText>
              </View>
              <View style={styles.footer}>
                <FormButton
                  onPress={(): void => {
                    Keyboard.dismiss()
                    navigation.push(Routes.Pin, {
                      type: 'auth',
                      result: async (result: boolean): Promise<void> => {
                        if (result) {
                          navigation.pop()
                          onClickApprove()
                        } else {
                          toast.show('PIN mismatch', {
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
                  Approve
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
