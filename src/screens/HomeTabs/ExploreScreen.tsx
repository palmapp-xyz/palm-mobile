import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'

import { Container } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const ExploreScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  useEffect(() => {
    navigation.navigate(Routes.InitExplore)
  }, [])

  return (
    <Container style={styles.container}>
      <Text>ExploreScreen</Text>
    </Container>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: {},
})
