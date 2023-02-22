import React, { ReactElement } from 'react'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'

import { Container, NftRenderer } from 'components'
import { UseGcReturn } from 'hooks/page/groupChannel/useGc'
import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'

const SellNftModal = ({
  useGcReturn,
}: {
  useGcReturn: UseGcReturn
}): ReactElement => {
  const { selectedNft, setSelectedNft, visibleModal } = useGcReturn

  const { user } = useAuth()
  const { nftList } = useUserNftList({ userAddress: user?.address })

  return (
    <Modal visible={visibleModal === 'sell'}>
      <Container style={styles.container}>
        <Text>SellNftModal</Text>
        <FlatList
          data={nftList}
          keyExtractor={(_, index): string => `nftList-${index}`}
          horizontal
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }): ReactElement => {
            const selected = selectedNft === item
            return (
              <TouchableOpacity
                style={{
                  height: 100,
                  width: 100,
                  borderColor: selected ? 'blue' : 'gray',
                  borderWidth: selected ? 1 : 0,
                  borderRadius: 20,
                  padding: 10,
                }}
                onPress={(): void => {
                  setSelectedNft(item)
                }}>
                <NftRenderer
                  nftContract={item.token_address}
                  tokenId={item.token_id}
                />
              </TouchableOpacity>
            )
          }}
        />
      </Container>
    </Modal>
  )
}

export default SellNftModal

const styles = StyleSheet.create({
  container: {},
})
