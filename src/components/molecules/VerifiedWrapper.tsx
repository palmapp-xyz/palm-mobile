import { COLOR } from 'core/consts'
import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const VerifiedWrapper = ({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <View style={styles.container}>
      {children}
      <View style={[styles.imgBox, style]}>
        <MaterialIcons name="verified" color={COLOR.primary._400} size={28} />
      </View>
    </View>
  )
}

export default VerifiedWrapper

const styles = StyleSheet.create({
  container: { position: 'relative' },
  imgBox: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
})
