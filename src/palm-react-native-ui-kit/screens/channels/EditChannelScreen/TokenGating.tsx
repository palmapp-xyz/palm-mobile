import _ from 'lodash'
import { COLOR, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { SupportedNetworkEnum, Token } from 'palm-core/types'
import {
  Container,
  FormButton,
  FormImage,
  FormText,
  Header,
  RadioIcon,
  SupportedNetworkRow,
} from 'palm-react-native-ui-kit/components'
import Indicator from 'palm-react-native-ui-kit/components/atoms/Indicator'
import useUserNftCollectionList from 'palm-react/hooks/api/useUserNftCollectionList'
import useUserNftList from 'palm-react/hooks/api/useUserNftList'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useUserBalance from 'palm-react/hooks/independent/useUserBalance'
import { UseEditChannelReturn } from 'palm-react/hooks/page/groupChannel/useEditChannel'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

const TokenGating = ({
  useEditChannelReturn,
}: {
  useEditChannelReturn: UseEditChannelReturn
}): ReactElement => {
  const {
    setShowTokenGating,
    selectedGatingToken,
    setSelectedGatingToken,
    updateGatingTokenNetwork,
    updateGatingTokenAmount,
  } = useEditChannelReturn

  const [step, setStep] = useState<1 | 2>(1)

  const { user } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()

  const gatingTokenNetwork =
    selectedGatingToken?.chain || SupportedNetworkEnum.ETHEREUM
  const gatingTokenAmount = selectedGatingToken?.amount || ''

  const { items: nftCollectionList, loading } = useUserNftCollectionList({
    selectedNetwork: gatingTokenNetwork,
    userAddress: user?.address,
    limit: 30,
  })

  const userBalances = useUserBalance({
    address: user?.address!,
    chain: gatingTokenNetwork,
  })
  const userNfts = useUserNftList({
    userAddress: user?.address!,
    selectedNetwork: gatingTokenNetwork,
  })

  const [enableDoneButton, setEnableDoneButton] = useState(false)

  useEffect(() => {
    if (step !== 2 || userBalances.isLoading || userNfts.loading) {
      return
    }

    if (userNfts.hasNextPage) {
      userNfts.fetchNextPage()
      return
    }

    if (selectedGatingToken.gatingType === 'NFT') {
      // NFT
      const count = userNfts.items.filter(
        i => i.name === selectedGatingToken.name
      ).length
      const input = Number(gatingTokenAmount)

      setEnableDoneButton(input > 0 && count >= input)
    } else {
      // Native
      const balance = UTIL.toBn(userBalances.balance)
      const input = UTIL.toBn(UTIL.microfyP(gatingTokenAmount as Token))

      setEnableDoneButton(!input.isZero() && balance.gte(input))
    }
  }, [gatingTokenAmount, userBalances, userNfts])

  return (
    <Container style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={bottom + 12}
      >
        <Header
          left={
            step === 2 ? (
              <Icon
                name="ios-chevron-back"
                color={COLOR.black._800}
                size={28}
              />
            ) : undefined
          }
          onPressLeft={(): void => {
            if (step === 2) {
              setStep(1)
            }
          }}
          right={
            <Icon name="ios-close-outline" color={COLOR.black._900} size={36} />
          }
          onPressRight={(): void => {
            setShowTokenGating(false)
          }}
        />
        <View style={styles.processBar}>
          <View
            style={[styles.process, { width: step === 1 ? '50%' : '100%' }]}
          />
        </View>
        <View style={styles.title}>
          <FormText font={'B'} size={16}>
            {step === 1
              ? t('Channels.ChatRoomTokenGatingSelectStep1')
              : t('Channels.ChatRoomTokenGatingSelectStep2')}
          </FormText>
        </View>
        {step === 1 ? (
          <View style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
              <SupportedNetworkRow
                selectedNetwork={gatingTokenNetwork}
                onNetworkSelected={updateGatingTokenNetwork}
              />
            </View>
            <ScrollView
              style={{
                flex: 1,
                backgroundColor: COLOR.black._90005,
              }}
            >
              <TouchableOpacity
                onPress={(): void => {
                  setSelectedGatingToken(ori => {
                    return {
                      amount: ori.amount,
                      chain: gatingTokenNetwork,
                      gatingType: 'Native',
                      name: NETWORK.nativeToken[gatingTokenNetwork],
                    }
                  })
                }}
                style={styles.tokenItem}
              >
                <RadioIcon
                  selected={selectedGatingToken.gatingType === 'Native'}
                />
                <FormImage
                  source={UTIL.getNetworkLogo(gatingTokenNetwork)}
                  size={40}
                />
                <View>
                  <FormText>{_.capitalize(gatingTokenNetwork)}</FormText>
                  <FormText font={'B'}>
                    {NETWORK.nativeToken[gatingTokenNetwork]}
                  </FormText>
                </View>
              </TouchableOpacity>
              {loading ? (
                <View style={styles.tokenItem}>
                  <Indicator />
                </View>
              ) : (
                _.map(nftCollectionList, (item, index) => {
                  const selected =
                    selectedGatingToken.gatingType === 'NFT' &&
                    item.token_address === selectedGatingToken.tokenAddress
                  return (
                    <TouchableOpacity
                      key={`nftCollectionList-${index}`}
                      style={styles.tokenItem}
                      onPress={(): void => {
                        setSelectedGatingToken(ori => {
                          return {
                            amount: ori.amount,
                            chain: gatingTokenNetwork,
                            gatingType: 'NFT',
                            name: item.name,
                            tokenAddress: item.token_address,
                            tokenType: item.contract_type,
                          }
                        })
                      }}
                    >
                      <RadioIcon selected={selected} />
                      <FormText>{item.name}</FormText>
                    </TouchableOpacity>
                  )
                })
              )}
            </ScrollView>
          </View>
        ) : (
          <View style={{ padding: 20, flex: 1 }}>
            <View style={styles.selectedItem}>
              {!!selectedGatingToken && (
                <FormText font={'B'} size={20}>
                  {selectedGatingToken.name}
                </FormText>
              )}
            </View>
            <TextInput
              keyboardType={
                selectedGatingToken.gatingType === 'NFT'
                  ? 'number-pad'
                  : 'numeric'
              }
              placeholder="0"
              style={{ fontWeight: 'bold', fontSize: 32, lineHeight: 44 }}
              value={gatingTokenAmount}
              onChangeText={updateGatingTokenAmount}
            />
          </View>
        )}
        <View style={styles.footer}>
          {step === 1 ? (
            <FormButton
              onPress={(): void => {
                setStep(2)
              }}
            >
              {t('Common.Next')}
            </FormButton>
          ) : (
            <FormButton
              disabled={!enableDoneButton}
              onPress={(): void => {
                setShowTokenGating(false)
              }}
            >
              {t('Common.Done')}
            </FormButton>
          )}
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

export default TokenGating

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  processBar: {
    backgroundColor: COLOR.black._90005,
  },
  process: {
    backgroundColor: COLOR.primary._400,
    height: 4,
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tokenItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    columnGap: 16,
  },
  selectedItem: {
    backgroundColor: COLOR.black._90005,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'baseline',
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
