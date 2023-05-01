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

import { Maybe } from '@toruslabs/openlogin'

import LinkRenderer from './LinkRenderer'
import NftAttributes from './NftAttributes'

const NftMetadata = ({
  metadata,
  style,
  containerStyle,
}: {
  metadata: Maybe<string>
  style?: StyleProp<ImageStyle>
  containerStyle?: StyleProp<ImageStyle>
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
      contentContainerStyle={[styles.container, containerStyle]}
      renderItem={({ item, index }): ReactElement | null => {
        if (item === null) {
          return null
        }
        const key = Object.keys(metadataJson)[index]
        return (
          <View style={style}>
            <Text style={styles.headText}>{_.capitalize(key)}</Text>
            {typeof item === 'object' ? (
              key === 'attributes' ? (
                <NftAttributes
                  attributes={item}
                  style={{ flex: 1, width: '100%' }}
                />
              ) : (
                <Text>{JSON.stringify(item, null, 2)}</Text>
              )
            ) : typeof item === 'string' &&
              item.includes('://') &&
              !item.includes(' ') ? (
              <LinkRenderer src={item} />
            ) : (
              <Text numberOfLines={5}>{String(item)}</Text>
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
