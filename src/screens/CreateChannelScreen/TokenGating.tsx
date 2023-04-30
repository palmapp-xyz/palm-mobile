import {
  Container, FormButton, FormImage, FormText, Header, KeyboardAvoidingView, SupportedNetworkRow
} from 'components'
import { COLOR, NETWORK } from 'consts'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import useAuth from 'hooks/auth/useAuth'
import { UseCreateChannelReturn } from 'hooks/page/groupChannel/useCreateChannel'
import _ from 'lodash'
import React, { ReactElement, useState } from 'react'
import {
  ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const Radio = ({ selected }: { selected: boolean }): ReactElement => {
  return (
    <View
      style={{
        borderColor: COLOR.primary._400,
        borderWidth: selected ? 5 : 1,
        borderRadius: 999,
        width: 16,
        height: 16,
      }}
    />
  )
}

const TokenGating = ({
  useCreateChannelReturn,
}: {
  useCreateChannelReturn: UseCreateChannelReturn
}): ReactElement => {
  const {
    setShowTokenGating,
    selectedGatingToken,
    gateTokenAddr,
    setSelectedGatingToken,
    gatingTokenAmount,
    setGatingTokenAmount,
    gatingTokenNetwork,
    setGatingTokenNetwork,
  } = useCreateChannelReturn

  const [step, setStep] = useState<1 | 2>(1)

  const { user } = useAuth()
  const { nftCollectionList, isLoading } = useUserNftCollectionList({
    selectedNetwork: gatingTokenNetwork,
    userAddress: user?.address,
    limit: 30,
  })

  const nativeToken = NETWORK.nativeToken[gatingTokenNetwork]

  return (
    <Container style={styles.container}>
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
            ? 'Please select a Token or NFT group'
            : 'How many does someone need to enter?'}
        </FormText>
      </View>
      {step === 1 ? (
        <View style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <SupportedNetworkRow
              selectedNetwork={gatingTokenNetwork}
              onNetworkSelected={(value): void => {
                setGatingTokenNetwork(value)
                setSelectedGatingToken(undefined)
              }}
            />
          </View>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
            }}>
            <TouchableOpacity
              onPress={(): void => {
                setSelectedGatingToken(nativeToken)
              }}
              style={styles.tokenItem}>
              <Radio selected={gateTokenAddr === nativeToken} />
              <FormImage
                source={NETWORK.getNetworkLogo(gatingTokenNetwork)}
                size={40}
              />
              <View>
                <FormText fontType="R.14">
                  {_.capitalize(gatingTokenNetwork)}
                </FormText>
                <FormText fontType="B.14">{nativeToken}</FormText>
              </View>
            </TouchableOpacity>
            {isLoading ? (
              <View style={styles.tokenItem}>
                <ActivityIndicator />
              </View>
            ) : (
              _.map(nftCollectionList, (item, index) => {
                const selected = item.token_address === gateTokenAddr
                return (
                  <TouchableOpacity
                    key={`nftCollectionList-${index}`}
                    style={styles.tokenItem}
                    onPress={(): void => {
                      setSelectedGatingToken(item)
                    }}>
                    {/* <MoralisNftRenderer
                item={item}
                width={'100%'}
                height={(size.width - gap) / 2.0}
              /> */}
                    <Radio selected={selected} />
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
              <FormText fontType="B.20">
                {typeof selectedGatingToken === 'string'
                  ? selectedGatingToken
                  : selectedGatingToken.name}
              </FormText>
            )}
          </View>
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            style={{ fontSize: 32 }}
            value={gatingTokenAmount}
            onChangeText={setGatingTokenAmount}
          />
        </View>
      )}
      <KeyboardAvoidingView>
        <View style={styles.footer}>
          {step === 1 ? (
            <FormButton
              disabled={!gateTokenAddr}
              onPress={(): void => {
                setStep(2)
              }}>
              Next
            </FormButton>
          ) : (
            <FormButton
              disabled={!gatingTokenAmount}
              onPress={(): void => {
                setShowTokenGating(false)
              }}>
              Done
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
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
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
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: `${COLOR.black._900}${COLOR.opacity._10}`,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
