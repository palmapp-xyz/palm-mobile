import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

import { Container } from 'components'

import {
  ExtendedProfile,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'

const LensFriendsScreen = (): ReactElement => {
  const onFollowPress = (
    profile: ExtendedProfile,
    profiles: ExtendedProfile[]
  ): void => {
    console.log(profile, profiles)
  }
  const onProfilePress = (profile: ExtendedProfile): ExtendedProfile => {
    console.log(profile)
    return profile
  }

  const props = {
    onFollowPress,
    onProfilePress,
  }

  return (
    <Container style={styles.container}>
      <Search {...props} />
    </Container>
  )
}

export default LensFriendsScreen

const styles = StyleSheet.create({
  container: {},
})
