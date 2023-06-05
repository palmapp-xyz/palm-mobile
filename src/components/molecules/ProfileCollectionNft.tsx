import Card from 'components/atoms/Card'
import FormText from 'components/atoms/FormText'
import MoralisNftRenderer from 'components/moralis/MoralisNftRenderer'
import { COLOR, UTIL } from 'consts'
import React, { ReactElement } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import { Moralis } from 'types'

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

  return (
    <TouchableOpacity onPress={onSelect}>
      <View
        style={[styles.container, { width: dim, height: dim, maxWidth: dim }]}
      >
        {collection.item ? (
          <MoralisNftRenderer
            item={collection.item}
            style={{ borderRadius: 12 }}
          />
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
          <FormText fontType="B.14" style={styles.headerText}>
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
