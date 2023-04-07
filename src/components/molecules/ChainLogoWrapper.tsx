import React, { ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import FormImage from 'components/atoms/FormImage'
import { SupportedNetworkEnum } from 'types'
import { NETWORK } from 'consts'

const ChainLogoWrapper = ({
  chain,
  children,
}: {
  chain: SupportedNetworkEnum
  children: ReactNode
}): ReactElement => {
  return (
    <View style={styles.container}>
      {children}
      <View style={styles.imgBox}>
        <FormImage source={NETWORK.getNetworkLogo(chain)} size={20} />
      </View>
    </View>
  )
}

export default ChainLogoWrapper

const styles = StyleSheet.create({
  container: { position: 'relative' },
  imgBox: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    right: 8,
    top: 8,
  },
})
