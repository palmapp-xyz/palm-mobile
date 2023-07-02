import { FormText } from 'components'
import { COLOR } from 'palm-core/consts'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

const Tag = ({ title }: { title: string }): ReactElement => {
  return (
    <View style={styles.item}>
      <FormText font={'SB'} color={COLOR.black._500}>
        #{title}
      </FormText>
    </View>
  )
}

export default Tag

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOR.black._50,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
})
