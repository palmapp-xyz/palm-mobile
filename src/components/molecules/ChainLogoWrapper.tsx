import FormImage from 'components/atoms/FormImage'
import { getNetworkLogo } from 'core/libs/utils'
import { SupportedNetworkEnum } from 'core/types'
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
        <FormImage source={getNetworkLogo(chain)} size={24} />
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
