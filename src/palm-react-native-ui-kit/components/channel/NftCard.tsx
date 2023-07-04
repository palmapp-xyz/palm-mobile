import { COLOR } from 'palm-core/consts'
import { Moralis } from 'palm-core/types'
import {
  Card,
  FormText,
  MoralisNftRenderer,
  Row,
} from 'palm-react-native-ui-kit/components'
import NftAttributes from 'palm-react-native-ui-kit/components/molecules/NftAttributes'
import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

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
          <FormText>{selectedNft.name}</FormText>
          <FormText font={'B'} size={18}>
            {selectedNft.name}#{selectedNft.token_id}
          </FormText>
        </View>
      </Row>
      <NftAttributes attributes={attributes} />
    </Card>
  )
}

export default NftCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.black._10,
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
