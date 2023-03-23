import { Maybe } from '@toruslabs/openlogin'
import { UTIL } from 'consts'
import _ from 'lodash'
import React, { ReactElement, useMemo } from 'react'

import {
  FlatList,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import NftAttributes from './NftAttributes'

const NftMetadata = ({
  metadata,
  style,
}: {
  metadata: Maybe<string>
  style?: StyleProp<ImageStyle>
}): ReactElement => {
  const metadataJson = useMemo(() => {
    const r = UTIL.jsonTryParse(metadata || '')
    if (r) {
      return r as object
    }
    return {}
  }, [metadata])

  return (
    <FlatList
      data={Object.values(metadataJson)}
      keyExtractor={(_item, index): string => `nft-metadata-${index}`}
      contentContainerStyle={[styles.container, style]}
      renderItem={({ item, index }): ReactElement | null => {
        if (item === null) {
          return null
        }
        const key = Object.keys(metadataJson)[index]
        return (
          <View>
            <Text style={styles.headText}>{_.capitalize(key)}</Text>
            {typeof item === 'object' ? (
              <NftAttributes
                attributes={item}
                style={{ flex: 1, width: '100%' }}
              />
            ) : (
              <Text>{typeof item === 'string' ? item : String(item)}</Text>
            )}
          </View>
        )
      }}
    />
  )
}

export default NftMetadata

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
