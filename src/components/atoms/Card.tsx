import React, { ReactElement } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

const Card = (props: ViewProps & { center?: boolean }): ReactElement => {
  const { style, center, ...rest } = props
  return (
    <View
      style={[styles.container, center ? styles.center : {}, style]}
      {...rest}
    />
  )
}

export default Card

const styles = StyleSheet.create({
  container: { padding: 30, borderRadius: 30, backgroundColor: 'white' },
  center: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
