import images from 'assets/images'
import {
  Container,
  FormButton,
  FormImage,
  FormText,
  MediaRenderer,
  Row,
} from 'components'
import { UTIL } from 'consts'
import useSendToken from 'hooks/page/groupChannel/useSendToken'
import { getFsProfile } from 'libs/firebase'
import { getProfileMediaImg } from 'libs/lens'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from 'react'
import { StyleSheet, View } from 'react-native'
import { FbProfile, Moralis, SupportedNetworkEnum, Token } from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'

import TokenAmountInput from './TokenAmountInput'

const Contents = ({
  selectedToken,
  receiverId,
  value,
  setShowBottomSheet,
  onSetValue,
}: {
  selectedToken: Moralis.FtItem
  receiverId: string
  value: Token
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
  onSetValue?: Dispatch<SetStateAction<Token>>
}): ReactElement => {
  const [receiver, setReceiver] = useState<FbProfile>()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)

  useAsyncEffect(async () => {
    const _receiver = await getFsProfile(receiverId)
    setReceiver(_receiver)
  }, [receiverId])

  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedToken.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { isValidForm } = useSendToken({
    selectedToken,
    receiver: receiver?.address,
    value: UTIL.microfyP(value),
  })

  const isValid = useMemo(
    () => !!receiver && value && Number(value) > 0 && isValidForm,
    [receiver, value, isValidForm]
  )

  return (
    <Container style={styles.container}>
      <View style={styles.body}>
        <View style={{ height: '100%', rowGap: 8 }}>
          <FormText fontType="SB.14" style={{ marginBottom: 8 }}>
            I want to send
          </FormText>
          <TokenAmountInput
            item={selectedToken}
            value={value}
            onSetValue={onSetValue}
            selectedNetwork={chain}
          />
          <Row style={{ padding: 8, columnGap: 8, marginTop: 8 }}>
            <FormText fontType="SB.14" style={{ marginTop: 6 }}>
              {'to '}
            </FormText>
            {receiverProfileImg ? (
              <MediaRenderer
                src={receiverProfileImg}
                width={32}
                height={32}
                style={{ borderRadius: 50 }}
              />
            ) : (
              <FormImage
                source={images.profile_temp}
                size={32}
                style={{ borderRadius: 50 }}
              />
            )}
            <FormText fontType="B.16" style={{ marginTop: 4 }}>
              {receiver?.handle}
            </FormText>
          </Row>
        </View>
        <FormButton
          disabled={!isValid}
          onPress={(): void => {
            setShowBottomSheet(true)
          }}
        >
          Send
        </FormButton>
      </View>
    </Container>
  )
}

export default Contents

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: -20,
    paddingTop: 0,
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
