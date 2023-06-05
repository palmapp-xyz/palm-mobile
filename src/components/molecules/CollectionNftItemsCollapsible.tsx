import Card from 'components/atoms/Card'
import React, { ReactElement, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import CollectionNftItems from './CollectionNftItems'

const CollectionNftItemsCollapsible = ({
  userAddress,
  contractAddress,
  selectedNetwork,
  headerText,
  onNftMenuSelected,
}: {
  userAddress?: ContractAddr
  contractAddress: ContractAddr
  selectedNetwork: SupportedNetworkEnum
  headerText?: string
  onNftMenuSelected?: (
    selectedItem: Moralis.NftItem,
    selectedOption: string
  ) => Promise<void>
}): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Card borderRound={true} style={styles.container}>
      <TouchableOpacity
        onPress={(): void => {
          setIsOpen(!isOpen)
        }}
      >
        <Text style={styles.headerText}>{headerText ?? contractAddress}</Text>
      </TouchableOpacity>
      {isOpen && (
        <Collapsible collapsed={!isOpen} style={{ marginTop: 20 }}>
          <CollectionNftItems
            userAddress={userAddress}
            contractAddress={contractAddress}
            selectedNetwork={selectedNetwork}
            onNftMenuSelected={onNftMenuSelected}
          />
        </Collapsible>
      )}
    </Card>
  )
}

export default CollectionNftItemsCollapsible

const styles = StyleSheet.create({
  container: { flex: 1, marginVertical: 4 },
  headerText: { fontSize: 16, fontWeight: '500' },
})
