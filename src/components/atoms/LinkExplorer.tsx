import { UTIL } from 'core/libs'
import { SupportedNetworkEnum } from 'core/types'
import useExplorer from 'hooks/complex/useExplorer'
import React, { ReactElement, ReactNode } from 'react'
import { Linking, TouchableOpacity } from 'react-native'

import Link from './Link'

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

  return children ? (
    <TouchableOpacity
      onPress={(): void => {
        Linking.openURL(getLink({ address, type, tokenId }))
      }}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <Link
      text={UTIL.truncate(address, [10, 10])}
      url={getLink({ address, type, tokenId })}
    />
  )
}

export default LinkExplorer
