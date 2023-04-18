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
        <FormImage source={NETWORK.getNetworkLogo(chain)} size={24} />
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
