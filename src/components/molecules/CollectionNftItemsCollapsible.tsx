import React, { ReactElement, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
    <View>
      <TouchableOpacity
        onPress={(): void => {
          setIsOpen(!isOpen)
        }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>{headerText ?? contractAddress}</Text>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <Collapsible collapsed={!isOpen}>
          <CollectionNftItems
            userAddress={userAddress}
            contractAddress={contractAddress}
            selectedNetwork={selectedNetwork}
            onNftMenuSelected={onNftMenuSelected}
          />
        </Collapsible>
      )}
    </View>
  )
}

export default CollectionNftItemsCollapsible

const styles = StyleSheet.create({
  header: { flex: 1, paddingHorizontal: 10, paddingVertical: 20 },
  headerText: { fontSize: 16, fontWeight: '500' },
})
