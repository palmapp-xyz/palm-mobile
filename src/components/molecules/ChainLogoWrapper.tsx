import FormImage from 'components/atoms/FormImage'
import { NETWORK } from 'consts'
import React, { ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { SupportedNetworkEnum } from 'types'

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
