import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'
import { ContractAddr } from 'types'
import { Container, Header, NftRenderer } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const Contents = ({
  nftContract,
  tokenId,
}: {
  nftContract: ContractAddr
  tokenId: string
}): ReactElement => {
  return (
    <View style={styles.body}>
      <View style={styles.imageBox}>
        <View style={{ height: 250 }}>
          <NftRenderer tokenId={tokenId} nftContract={nftContract} />
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.infoDetails}>
          <View>
            <Text>Token Contract</Text>
            <Text>{nftContract}</Text>
          </View>
          <View>
            <Text>Token ID</Text>
            <Text>{tokenId}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const NftDetailScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.NftDetail>()

  return (
    <Container style={styles.container}>
      <Header
        title="NFT Info"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <Contents nftContract={params.nftContract} tokenId={params.tokenId} />
    </Container>
  )
}

export default NftDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageBox: { width: '100%' },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  infoDetails: { rowGap: 10 },
})
