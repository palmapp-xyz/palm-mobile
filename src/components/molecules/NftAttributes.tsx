import FormText from 'components/atoms/FormText'
import Row from 'components/atoms/Row'
import { COLOR } from 'core/consts'
import React, { ReactElement } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

const NftAttributes = ({
  attributes,
}: {
  attributes: { trait_type: string; value: string }[]
}): ReactElement | null => {
  return (
    <Row style={styles.traitsBox}>
      <FlatList
        data={attributes}
        keyExtractor={(item, index): string => `attributes-${index}`}
        horizontal
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }): ReactElement => {
          return (
            <View style={styles.traits}>
              <FormText>{item.trait_type}</FormText>
              <FormText font={'B'} size={16} color={COLOR.black._900}>
                {item.value}
              </FormText>
            </View>
          )
        }}
      />
    </Row>
  )
}

export default NftAttributes

const styles = StyleSheet.create({
  traitsBox: {
    columnGap: 10,
    flex: 1,
    width: '100%',
  },
  traits: {
    rowGap: 4,
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderColor: COLOR.black._10,
    borderWidth: 1,
  },
})
