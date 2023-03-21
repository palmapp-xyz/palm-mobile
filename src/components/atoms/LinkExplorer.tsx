import React, { ReactElement, ReactNode } from 'react'
import { Linking, Text, TouchableOpacity } from 'react-native'

import { COLOR, UTIL } from 'consts'

import useExplorer from 'hooks/complex/useExplorer'
import { SupportedNetworkEnum } from 'types'

const LinkExplorer = ({
  address,
  type,
  children,
  network,
}: {
  address: string
  type: 'tx' | 'account'
  children?: ReactNode
  network: SupportedNetworkEnum
}): ReactElement => {
  const { getLink } = useExplorer(network)

  return (
    <TouchableOpacity
      onPress={(): void => {
        Linking.openURL(getLink({ address, type }))
      }}>
      {children || (
        <Text style={{ color: COLOR.primary._400 }}>
          {UTIL.truncate(address, [10, 10])}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export default LinkExplorer
