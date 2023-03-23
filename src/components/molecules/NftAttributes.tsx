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
}: {
  attributes: { trait_type: string; value: string }[]
  style?: StyleProp<ImageStyle>
}): ReactElement | null => {
  if (!attributes) {
    return null
  }
  return (
    <FlatList
      numColumns={3}
      data={attributes}
      keyExtractor={({ trait_type }): string => `nft-attribute-${trait_type}`}
      contentContainerStyle={[styles.container, style]}
      renderItem={({ item: { trait_type, value } }): ReactElement | null => (
        <View style={{ flex: 1 }}>
          <Text style={styles.headText}>{_.capitalize(trait_type)}</Text>
          <Text>
            {typeof value === 'string'
              ? value
              : typeof value === 'object'
              ? JSON.stringify(value)
              : String(value)}
          </Text>
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
  headText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
