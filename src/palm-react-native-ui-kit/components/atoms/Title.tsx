import { COLOR } from 'palm-core/consts'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import FormText from './FormText'

const Title = ({ title }: { title: string }): ReactElement => {
  return (
    <View>
      <FormText
        style={{ marginVertical: 12, marginHorizontal: 20 }}
        color={COLOR.black._300}
      >
        {title}
      </FormText>
      <View style={{ height: 1, backgroundColor: COLOR.black._90005 }} />
    </View>
  )
}

export default Title
