import { COLOR } from 'consts'
import React, { ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const VerifiedWrapper = ({
  children,
}: {
  children: ReactNode
}): ReactElement => {
  return (
    <View style={styles.container}>
      {children}
      <View style={styles.imgBox}>
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
