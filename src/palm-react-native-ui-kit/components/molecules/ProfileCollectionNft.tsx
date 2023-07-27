import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Moralis } from 'palm-core/types'
import Card from 'palm-react-native-ui-kit/components/atoms/Card'
import FormText from 'palm-react-native-ui-kit/components/atoms/FormText'
import MoralisNftRenderer from 'palm-react-native-ui-kit/components/moralis/MoralisNftRenderer'
import React, { ReactElement } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'

import { Icon } from '@sendbird/uikit-react-native-foundation'

const ProfileCollectionNft = ({
  collection,
  onSelect,
}: {
  collection: Moralis.NftCollection
  onSelect: () => void
}): ReactElement => {
  const size = useWindowDimensions()
  const dim = size.width / 2.0 - 12

  const headerText: string = `${
    collection.name ??
    collection.symbol ??
    UTIL.truncate(collection.token_address)
  }`

  const item: Moralis.NftItem | undefined | null = collection.preload
    ? _.head(collection.preload.result)
    : undefined

  return (
    <TouchableOpacity onPress={onSelect}>
      <View
        style={[styles.container, { width: dim, height: dim, maxWidth: dim }]}
      >
        {item ? (
          <MoralisNftRenderer item={item} style={{ borderRadius: 12 }} />
        ) : (
          <Card
            borderRound={true}
            style={[
              styles.container,
              { width: dim, height: dim, maxWidth: dim },
            ]}
          >
            <Icon icon={'error'} size={24} color={COLOR.primary._300} />
          </Card>
        )}
        <View style={styles.headerTextBox}>
          <FormText font={'B'} style={styles.headerText}>
            {headerText}
          </FormText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProfileCollectionNft

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTextBox: {
    borderRadius: 16,
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._30}`,
    bottom: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flex: 1,
    width: '95%',
  },
  headerText: {
    color: COLOR.white,
  },
  item: {
    margin: 4,
  },
})
