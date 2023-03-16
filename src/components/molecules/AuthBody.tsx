import React, { ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { Container } from 'components'

const AuthBody = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <Container style={styles.container}>
      <View style={styles.bottomBody}>{children}</View>
    </Container>
  )
}

export default AuthBody

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  bottomBody: {
    backgroundColor: '#ffffff99',
    padding: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginBottom: -40,
    paddingBottom: 70,
  },
})
