import React, { ReactElement, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { Card, FormText, MoralisNftRenderer, Row } from 'components'
import { COLOR } from 'consts'
import { Moralis } from 'types'

const NftCard = ({
  selectedNft,
}: {
  selectedNft: Moralis.NftItem
}): ReactElement => {
  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([])

  useEffect(() => {
    try {
      setAttributes(JSON.parse(selectedNft.metadata || '')?.attributes)
    } catch {}
  }, [])

  return (
    <Card style={styles.container}>
      <Row style={{ paddingBottom: 20 }}>
        <View
          style={{
            width: 100,
            height: 100,
            marginEnd: 10,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <MoralisNftRenderer item={selectedNft} />
        </View>
        <View style={{ rowGap: 10, paddingRight: 20, flex: 1 }}>
          <FormText fontType="R.14">{selectedNft.name}</FormText>
          <FormText fontType="B.18">
            {selectedNft.name}#{selectedNft.token_id}
          </FormText>
        </View>
      </Row>
      <Row style={styles.traitsBox}>
        <FlatList
          data={attributes}
          keyExtractor={(item, index): string => `attributes-${index}`}
          horizontal
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }): ReactElement => {
            return (
              <View style={styles.traits}>
                <FormText fontType="R.12">{item.trait_type}</FormText>
                <FormText fontType="B.14" color={COLOR.black._900}>
                  {item.value}
                </FormText>
              </View>
            )
          }}
        />
      </Row>
    </Card>
  )
}

export default NftCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.black._90010,
    borderRadius: 24,
    padding: 20,
    paddingRight: 0,
  },
  traitsBox: {
    columnGap: 10,
  },
  traits: {
    rowGap: 4,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
})
