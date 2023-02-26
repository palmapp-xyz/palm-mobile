import React, { ReactElement, ReactNode } from 'react'
import { Linking, Text, TouchableOpacity } from 'react-native'

import { COLOR, UTIL } from 'consts'

import useExplorer from 'hooks/complex/useExplorer'

const LinkExplorer = ({
  address,
  type,
  children,
}: {
  address: string
  type: 'tx' | 'account'
  children?: ReactNode
}): ReactElement => {
  const { getLink } = useExplorer()

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
