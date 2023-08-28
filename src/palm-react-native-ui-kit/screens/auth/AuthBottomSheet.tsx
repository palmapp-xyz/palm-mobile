import { BottomSheetView } from '@gorhom/bottom-sheet'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { recordError } from 'palm-core/libs/logger'
import {
  FormBottomSheet,
  FormButtonWithLottie,
  FormText,
  Row,
  SkeletonView,
} from 'palm-react-native-ui-kit/components'
import useSign4Auth from 'palm-react/hooks/page/sign/useSign4Auth'
import images from 'palm-ui-kit/assets/images'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import React, { View } from 'react-native'

type AuthenticateSource = {
  account: string
  uri: string
  issuedAt: string
  expirationTime: Date
}

const ErrorBox = ({ text }: { text: string }): ReactElement => {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: `${COLOR.red}${COLOR.opacity._05}`,
      }}
    >
      <FormText color={COLOR.red}>{text}</FormText>
    </View>
  )
}

const AuthBottomSheet = (props: {
  type: 'imported' | 'verified'
  show: boolean
  setShow: (show: boolean) => void
  onPress: () => void
}): ReactElement => {
  const { tryChallenge, challenge, signChallenge } = useSign4Auth()
  //   const isFetching = useRecoilValue(fetchApiStore.isFetchingPostApiStore)

  const [timeLeft, setTimeLeft] = useState('')
  const [isChallengeExtracted, setChallengeExtracted] = useState(false)
  const [isChallenging, setChallenging] = useState(false)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const snapPoints = useMemo(() => ['70%'], [])

  const [extractedData, setExtractedData] = useState<AuthenticateSource>({
    account: '',
    uri: '',
    issuedAt: '',
    expirationTime: new Date(),
  })

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }

  // fetch challenge
  useEffect(() => {
    try {
      if (challenge?.message) {
        const message = challenge?.message

        const uriMatch = message.match(/URI: (https:\/\/[^\s]+)/)
        const issuedAtMatch = message.match(/Issued At: ([\w\-\:\.]+)/)
        const expirationTimeMatch = message.match(
          /Expiration Time: ([\w\-\:\.]+)/
        )
        const accountMatch = message.match(/0x[\w\d]+/)

        setExtractedData({
          account: accountMatch ? accountMatch[0] : '',
          uri: uriMatch ? uriMatch[1] : '',
          issuedAt: issuedAtMatch ? issuedAtMatch[1] : '',
          expirationTime: expirationTimeMatch
            ? new Date(expirationTimeMatch[1])
            : new Date(),
        })
      }
    } catch (e) {
      recordError(e)
    }
  }, [challenge])

  // check if challenge is extracted
  useEffect(() => {
    if (extractedData.account !== '') {
      setChallengeExtracted(true)
    }
  }, [extractedData])

  // calculate time left
  useEffect((): void => {
    const calculateTimeLeft = (): void => {
      const expirationTime = extractedData.expirationTime
      const currentTime = new Date()

      const differenceInMilliseconds =
        expirationTime.getTime() - currentTime.getTime()
      const differenceInMinutes = Math.floor(
        differenceInMilliseconds / 1000 / 60
      )

      if (differenceInMinutes <= 0) {
        setTimeLeft('(Expired)')
        clearInterval(intervalId)
      } else {
        setTimeLeft(`(${differenceInMinutes} mins left)`)
      }
    }
    calculateTimeLeft()

    const intervalId = setInterval(calculateTimeLeft, 60 * 1000)

    return clearInterval(intervalId)
  }, [extractedData])

  useEffect(() => {
    if (errorOccurred) {
      setChallengeExtracted(false)
      setChallenging(false)
      tryChallenge()
    }
  }, [errorOccurred])

  const signChallengeAndClose = async (): Promise<void> => {
    setChallenging(true)
    setErrorOccurred(false)
    try {
      await signChallenge()
      props.onPress()
    } catch (e) {
      setErrorOccurred(true)
    } finally {
      setChallenging(false)
    }
  }

  return (
    <>
      <FormBottomSheet
        showBottomSheet={props.show}
        snapPoints={snapPoints}
        onClose={(): void => {
          props.setShow(false)
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 40,
              gap: 8,
            }}
          >
            <FormText font="B" size={24} color={COLOR.black._900}>
              {'Please authenticate to sign in with the wallet'}
            </FormText>
            <FormText color={COLOR.black._400}>
              {`Your wallet has been successfully ${props.type}. You need to authenticate for sign in.`}
            </FormText>
          </View>
          <View style={{ gap: 12, marginHorizontal: 20 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <FormText color={COLOR.black._400}>Wallet Address</FormText>
              {isChallengeExtracted ? (
                <FormText color={COLOR.black._900}>
                  {UTIL.truncate(extractedData?.account, [6, 4])}
                </FormText>
              ) : (
                <SkeletonView width={150} height={20} />
              )}
            </Row>
            <Row style={{ justifyContent: 'space-between' }}>
              <FormText color={COLOR.black._400}>URI</FormText>
              {isChallengeExtracted ? (
                <FormText color={COLOR.black._900}>
                  {extractedData?.account !== '' && extractedData?.uri}
                </FormText>
              ) : (
                <SkeletonView width={150} height={20} />
              )}
            </Row>
            <Row style={{ justifyContent: 'space-between' }}>
              <FormText color={COLOR.black._400}>Expiration at</FormText>
              {isChallengeExtracted ? (
                <FormText color={COLOR.black._900}>
                  {extractedData?.account !== '' &&
                    new Intl.DateTimeFormat('en-US', dateOptions).format(
                      extractedData?.expirationTime
                    )}
                </FormText>
              ) : (
                <SkeletonView width={150} height={20} />
              )}
            </Row>
          </View>
          <Row
            style={{
              marginHorizontal: 20,
              justifyContent: 'flex-end',
            }}
          >
            {isChallengeExtracted && (
              <FormText color={COLOR.primary._400}>
                {extractedData?.account !== '' && timeLeft}
              </FormText>
            )}
          </Row>
          {errorOccurred && (
            <Row
              style={{
                marginVertical: 12,
                marginHorizontal: 20,
                justifyContent: 'center',
              }}
            >
              <ErrorBox
                text={
                  'An error has occured during the authentication process. Please try again.'
                }
              />
            </Row>
          )}
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            <View style={{ height: 1, backgroundColor: COLOR.black._90005 }} />
            <FormButtonWithLottie
              containerStyle={{
                marginHorizontal: 20,
                marginVertical: 12,
              }}
              disabled={!isChallengeExtracted || isChallenging}
              leftIcon={isChallenging ? images.button_spinner : undefined}
              leftIconSize={16}
              onPress={signChallengeAndClose}
            >
              {isChallenging
                ? 'Authenticating...'
                : !isChallengeExtracted
                ? 'Challenging...'
                : 'Authenticate'}
            </FormButtonWithLottie>
          </View>
        </BottomSheetView>
      </FormBottomSheet>
    </>
  )
}

export default AuthBottomSheet
