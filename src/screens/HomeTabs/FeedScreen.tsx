import React, { ReactElement } from 'react'
import { StyleSheet, Text } from 'react-native'

import { Container } from 'components'

const FeedScreen = (): ReactElement => {
  return (
    <Container style={styles.container}>
      <Text>FeedScreen</Text>
    </Container>
  )
}

export default FeedScreen

const styles = StyleSheet.create({
  container: {},
})
