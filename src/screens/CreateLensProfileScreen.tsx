import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { Container, FormButton, FormInput } from 'components'
import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'
import useFsProfile from 'hooks/firestore/useFsProfile'

const CreateLensProfileScreen = (): ReactElement => {
  const { user } = useAuth()
  const { createProfile } = useLens()

  const [handle, setHandle] = useState('')

  const {
    fsProfile,
    fsProfileField,
    refetch: refetchProfile,
  } = useFsProfile({
    address: user?.address,
  })

  const { refetch: refetchLensProfile, loading: lensProfileFetchLoading } =
    useLensProfile({
      userAddress: user?.address,
    })

  const { alert } = useAlert()

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const onClickConfirm = async (): Promise<void> => {
    if (!fsProfile) {
      return
    }
    setLoading(true)
    setTimeout(async () => {
      try {
        const res = await createProfile({
          handle,
        })

        if (res.success) {
          await fsProfile.update({ handle })
          await Promise.all([refetchProfile(), refetchLensProfile()])
        } else {
          throw new Error(res.errMsg)
        }
      } catch (error) {
        console.error(
          'createProfile:onClickConfirm',
          JSON.stringify(error, null, 2)
        )
        alert({ message: JSON.stringify(error, null, 2) })
      }
    }, 500)
  }

  useEffect(() => {
    if (fsProfileField?.handle) {
      setLoading(false)
    }
  }, [fsProfileField])

  return (
    <Container style={styles.container}>
      <View style={styles.body}>
        <View style={{ paddingTop: 30, alignItems: 'center' }}>
          <Text style={styles.text}>{'Create your Lens profile'}</Text>
        </View>
        <Text style={styles.text}>Choose Username:</Text>
        <FormInput
          value={handle}
          onChangeText={setHandle}
          textContentType="username"
        />
        <FormButton
          disabled={!handle || loading || lensProfileFetchLoading}
          onPress={onClickConfirm}>
          Mint Profile NFT
        </FormButton>
      </View>
    </Container>
  )
}

export default CreateLensProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  body: {
    gap: 20,
    padding: 10,
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
})
