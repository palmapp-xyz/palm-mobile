import { UTIL } from 'palm-core/libs'
import { SupportedNetworkEnum } from 'palm-core/types'
import FormImage from 'palm-react-native-ui-kit/components/atoms/FormImage'
import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

const ChainLogoWrapper = ({
  chain,
  containerStyle,
  children,
}: {
  chain: SupportedNetworkEnum
  containerStyle?: StyleProp<ViewStyle>
  children: ReactNode
}): ReactElement => {
  return (
    <View style={[styles.container, containerStyle]}>
      {children}
      <View style={styles.imgBox}>
        <FormImage source={UTIL.getNetworkLogo(chain)} size={24} />
      </View>
    </View>
  )
}

export default ChainLogoWrapper

const styles = StyleSheet.create({
  container: { position: 'relative' },
  imgBox: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
})
