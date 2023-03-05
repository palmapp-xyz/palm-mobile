import React, { ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import images from 'assets/images'
import FormImage from 'components/atoms/FormImage'

const EthLogoWrapper = ({
  children,
}: {
  children: ReactNode
}): ReactElement => {
  return (
    <View style={styles.container}>
      {children}
      <View style={styles.imgBox}>
        <FormImage source={images.eth_logo} size={20} />
      </View>
    </View>
  )
}

export default EthLogoWrapper

const styles = StyleSheet.create({
  container: { position: 'relative' },
  imgBox: {
    position: 'absolute',
    margin: 5,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#ffffff99',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
