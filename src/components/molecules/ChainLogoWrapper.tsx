import React, { ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import images from 'assets/images'
import FormImage from 'components/atoms/FormImage'
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
        <FormImage
          source={
            chain === SupportedNetworkEnum.POLYGON
              ? images.matic_logo
              : chain === SupportedNetworkEnum.KLAYTN
              ? images.klay_logo
              : images.eth_logo
          }
          size={20}
        />
      </View>
    </View>
  )
}

export default ChainLogoWrapper

const styles = StyleSheet.create({
  container: { position: 'relative' },
  imgBox: {
    position: 'absolute',
    margin: 5,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
