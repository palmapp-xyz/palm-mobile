import { COLOR } from 'consts'
import _ from 'lodash'
import React, { ReactElement } from 'react'

import {
  FlatList,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const NftAttributes = ({
  attributes,
  style,
  itemStyle,
  numColumns = 3,
}: {
  attributes: { trait_type: string; value: string }[]
  style?: StyleProp<ImageStyle>
  itemStyle?: StyleProp<ImageStyle>
  numColumns?: number
}): ReactElement | null => {
  if (!attributes) {
    return null
  }
  return (
    <FlatList
      numColumns={numColumns}
      scrollEnabled={false}
      data={attributes}
      keyExtractor={({ trait_type }): string => `nft-attribute-${trait_type}`}
      contentContainerStyle={[styles.container, style]}
      renderItem={({ item: { trait_type, value } }): ReactElement | null => (
        <View style={[styles.item, itemStyle]}>
          <Text style={styles.headText}>{_.capitalize(trait_type)}</Text>
          <View style={{ maxWidth: 100 }}>
            <Text style={{ flex: 1, flexWrap: 'wrap' }}>
              {typeof value === 'string'
                ? value
                : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value)}
            </Text>
          </View>
        </View>
      )}
    />
  )
}

export default NftAttributes

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    rowGap: 10,
  },
  item: {
    margin: 10,
    borderRadius: 5,
    borderColor: COLOR.black._400,
    borderWidth: 1,
    padding: 10,
  },
  headText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
