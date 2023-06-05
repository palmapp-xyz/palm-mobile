import Card from 'components/atoms/Card'
import MoralisNftRenderer from 'components/moralis/MoralisNftRenderer'
import React, { ReactElement, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import Collapsible from 'react-native-collapsible'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import ChainLogoWrapper from './ChainLogoWrapper'
import CollectionNftItems from './CollectionNftItems'

const CollectionNftItemsCollapsible = ({
  userAddress,
  contractAddress,
  selectedNetwork,
  headerText,
  headerItem,
  onNftMenuSelected,
}: {
  userAddress?: ContractAddr
  contractAddress: ContractAddr
  selectedNetwork: SupportedNetworkEnum
  headerText: string
  headerItem: Moralis.NftItem | null | undefined
  onNftMenuSelected?: (
    selectedItem: Moralis.NftItem,
    selectedOption: string
  ) => Promise<void>
}): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const size = useWindowDimensions()
  const dim = size.width / 2.0 - 32

  return (
    <Card borderRound={true} style={styles.container}>
      <TouchableOpacity
        onPress={(): void => {
          setIsOpen(!isOpen)
        }}
      >
        <Text style={styles.headerText}>{headerText ?? contractAddress}</Text>
        {headerItem && !isOpen && (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ChainLogoWrapper
              chain={selectedNetwork}
              containerStyle={[
                { width: dim, height: dim },
                styles.item,
                { maxWidth: dim },
              ]}
            >
              <MoralisNftRenderer item={headerItem} />
            </ChainLogoWrapper>
          </View>
        )}
      </TouchableOpacity>
      {isOpen && (
        <Collapsible collapsed={!isOpen} style={{ marginTop: 20 }}>
          <CollectionNftItems
            userAddress={userAddress}
            contractAddress={contractAddress}
            selectedNetwork={selectedNetwork}
            onNftMenuSelected={onNftMenuSelected}
            itemSize={dim}
          />
        </Collapsible>
      )}
    </Card>
  )
}

export default CollectionNftItemsCollapsible

const styles = StyleSheet.create({
  container: { flex: 1, marginVertical: 2 },
  headerText: { fontSize: 12 },
  item: {
    margin: 4,
  },
})
