import _ from 'lodash'
import { COLOR, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import {
  ContractAddr,
  FbChannelGatingField,
  SupportedNetworkEnum,
  Token,
} from 'palm-core/types'
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
import { UseCreateChannelReturn } from 'palm-react/hooks/page/groupChannel/useCreateChannel'
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

const TokenGatingStep1 = ({
  userAddress,
  gatingTokenNetwork,
  updateGatingTokenNetwork,
  selectedGatingToken,
  setSelectedGatingToken,
}: {
  userAddress: ContractAddr
  gatingTokenNetwork: SupportedNetworkEnum
  updateGatingTokenNetwork:
    | ((chain: SupportedNetworkEnum) => void)
    | ((chain: SupportedNetworkEnum) => void)
  selectedGatingToken: FbChannelGatingField
  setSelectedGatingToken: React.Dispatch<
    React.SetStateAction<FbChannelGatingField>
  >
}): ReactElement => {
  const { items: nftCollectionList, loading } = useUserNftCollectionList({
    selectedNetwork: gatingTokenNetwork,
    userAddress: userAddress,
    limit: 30,
  })

  return (
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
          <RadioIcon selected={selectedGatingToken.gatingType === 'Native'} />
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
  )
}

const TokenGatingStep2 = ({
  selectedGatingToken,
  gatingAmount,
  setGatingAmount,
}: {
  selectedGatingToken: FbChannelGatingField
  gatingAmount: string
  setGatingAmount: ((amount: string) => void) | ((amount: string) => void)
}): ReactElement => {
  return (
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
          selectedGatingToken.gatingType === 'NFT' ? 'number-pad' : 'numeric'
        }
        placeholder="0"
        style={{ fontWeight: 'bold', fontSize: 32, lineHeight: 44 }}
        value={gatingAmount}
        onChangeText={setGatingAmount}
      />
    </View>
  )
}

const TokenGatingNft = ({
  step,
  userAddress,
  gatingNetwork,
  selectedGatingToken,
  gatingAmount,
  setGatingAmount,
  setNextButton,
}: {
  step: 1 | 2
  userAddress: ContractAddr
  gatingNetwork: SupportedNetworkEnum
  selectedGatingToken: FbChannelGatingField
  gatingAmount: string
  setGatingAmount: ((amount: string) => void) | ((amount: string) => void)
  setNextButton: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const userNfts = useUserNftList({
    userAddress: userAddress,
    selectedNetwork: gatingNetwork,
  })

  useEffect(() => {
    if (step !== 2 || userNfts.loading) {
      return
    }

    if (userNfts.hasNextPage) {
      userNfts.fetchNextPage()
      return
    }

    const count = userNfts.items.filter(
      i => i.name === selectedGatingToken.name
    ).length
    const input = Number(gatingAmount)

    setNextButton(input > 0 && count >= input)
  }, [gatingAmount, userNfts])
  return (
    <TokenGatingStep2
      selectedGatingToken={selectedGatingToken}
      gatingAmount={gatingAmount}
      setGatingAmount={setGatingAmount}
    />
  )
}

const TokenGatingToken = ({
  step,
  userAddress,
  gatingNetwork,
  selectedGatingToken,
  gatingAmount,
  setGatingAmount,
  setNextButton,
}: {
  step: 1 | 2
  userAddress: ContractAddr
  gatingNetwork: SupportedNetworkEnum
  selectedGatingToken: FbChannelGatingField
  gatingAmount: string
  setGatingAmount: ((amount: string) => void) | ((amount: string) => void)
  setNextButton: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const userBalance = useUserBalance({
    address: userAddress,
    chain: gatingNetwork,
  })

  useEffect(() => {
    if (step !== 2 || userBalance.isLoading) {
      return
    }

    const balance = UTIL.toBn(userBalance.balance)
    const input = UTIL.toBn(UTIL.microfyP(gatingAmount as Token))

    setNextButton(!input.isZero() && balance.gte(input))
  }, [gatingAmount, userBalance])
  return (
    <TokenGatingStep2
      selectedGatingToken={selectedGatingToken}
      gatingAmount={gatingAmount}
      setGatingAmount={setGatingAmount}
    />
  )
}

const TokenGating = ({
  useChannelReturn,
}: {
  useChannelReturn: UseEditChannelReturn | UseCreateChannelReturn
}): ReactElement => {
  const {
    setShowTokenGating,
    selectedGatingToken,
    setSelectedGatingToken,
    updateGatingTokenNetwork,
    updateGatingTokenAmount,
  } = useChannelReturn

  const [step, setStep] = useState<1 | 2>(1)

  const { user } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()

  const gatingTokenNetwork =
    selectedGatingToken?.chain || SupportedNetworkEnum.ETHEREUM
  const gatingTokenAmount = selectedGatingToken?.amount || ''

  const [enableDoneButton, setEnableDoneButton] = useState(false)

  return (
    <Container style={styles.container} keyboardAvoiding={true}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: bottom + 12 })}
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
        {step === 1 && (
          <TokenGatingStep1
            userAddress={user?.address!}
            gatingTokenNetwork={gatingTokenNetwork}
            selectedGatingToken={selectedGatingToken}
            setSelectedGatingToken={setSelectedGatingToken}
            updateGatingTokenNetwork={updateGatingTokenNetwork}
          />
        )}
        {step === 2 &&
          (selectedGatingToken.gatingType === 'NFT' ? (
            <TokenGatingNft
              step={step}
              userAddress={user?.address!}
              gatingNetwork={gatingTokenNetwork}
              setNextButton={setEnableDoneButton}
              selectedGatingToken={selectedGatingToken}
              gatingAmount={gatingTokenAmount}
              setGatingAmount={updateGatingTokenAmount}
            />
          ) : (
            <TokenGatingToken
              step={step}
              userAddress={user?.address!}
              gatingNetwork={gatingTokenNetwork}
              setNextButton={setEnableDoneButton}
              selectedGatingToken={selectedGatingToken}
              gatingAmount={gatingTokenAmount}
              setGatingAmount={updateGatingTokenAmount}
            />
          ))}
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
