import React, { ReactElement } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

const Card = (props: ViewProps): ReactElement => {
  const { style, ...rest } = props
  return <View style={[styles.container, style]} {...rest} />
}

export default Card

const styles = StyleSheet.create({
  container: { padding: 30, borderRadius: 30, backgroundColor: 'white' },
})
