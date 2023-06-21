import {
  Container,
  FormButton,
  FormImage,
  FormText,
  Header,
  RadioIcon,
  SupportedNetworkRow,
} from 'components'
import Indicator from 'components/atoms/Indicator'
import { COLOR, NETWORK } from 'consts'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import useAuth from 'hooks/auth/useAuth'
import { UseCreateChannelReturn } from 'hooks/page/groupChannel/useCreateChannel'
import _ from 'lodash'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { SupportedNetworkEnum } from 'types'

const TokenGating = ({
  useCreateChannelReturn,
}: {
  useCreateChannelReturn: UseCreateChannelReturn
}): ReactElement => {
  const {
    setShowTokenGating,
    selectedGatingToken,
    setSelectedGatingToken,
    updateGatingTokenNetwork,
    updateGatingTokenAmount,
  } = useCreateChannelReturn

  const [step, setStep] = useState<1 | 2>(1)

  const { user } = useAuth()
  const { t } = useTranslation()

  const gatingTokenNetwork =
    selectedGatingToken?.chain || SupportedNetworkEnum.ETHEREUM
  const gatingTokenAmount = selectedGatingToken?.amount || ''

  const { items: nftCollectionList, loading } = useUserNftCollectionList({
    selectedNetwork: gatingTokenNetwork,
    userAddress: user?.address,
    limit: 30,
  })

  return (
    <Container style={styles.container} keyboardAvoiding={true}>
      <Header
        left={
          step === 2 ? (
            <Icon name="ios-chevron-back" color={COLOR.black._800} size={28} />
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
        <FormText fontType="B.16">
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
                source={NETWORK.getNetworkLogo(gatingTokenNetwork)}
                size={40}
              />
              <View>
                <FormText fontType="R.14">
                  {_.capitalize(gatingTokenNetwork)}
                </FormText>
                <FormText fontType="B.14">
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
              <FormText fontType="B.20">{selectedGatingToken.name}</FormText>
            )}
          </View>
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            style={{ fontSize: 32 }}
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
            disabled={!gatingTokenAmount}
            onPress={(): void => {
              setShowTokenGating(false)
            }}
          >
            {t('Common.Done')}
          </FormButton>
        )}
      </View>
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
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
