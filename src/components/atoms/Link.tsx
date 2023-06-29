import { COLOR } from 'consts'
import { isValidHttpUrl } from 'libs/utils'
import React, { ReactElement } from 'react'
import { Linking, TouchableOpacity } from 'react-native'

import FormText from './FormText'

const Link = ({ text, url }: { text: string; url: string }): ReactElement => {
  return (
    <TouchableOpacity
      onPress={(): void => {
        if (isValidHttpUrl(url)) {
          Linking.openURL(url)
        }
      }}
    >
      <FormText style={{ color: COLOR.primary._400 }}>{text}</FormText>
    </TouchableOpacity>
  )
}

export default Link
