import { COLOR, UTIL } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import React, { ReactElement, ReactNode } from 'react'
import { Linking, Text, TouchableOpacity } from 'react-native'
import { SupportedNetworkEnum } from 'types'

const LinkExplorer = ({
  address,
  tokenId,
  type,
  children,
  network,
}: {
  address: string
  tokenId?: string
  type: 'tx' | 'address' | 'nft'
  children?: ReactNode
  network: SupportedNetworkEnum
}): ReactElement => {
  const { getLink } = useExplorer(network)

  return (
    <TouchableOpacity
      onPress={(): void => {
        Linking.openURL(getLink({ address, type, tokenId }))
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
