import { COLOR } from 'palm-core/consts'
import { fixTokenUri } from 'palm-core/libs/ipfs'
import { isValidHttpUrl } from 'palm-react-native/lib/utils'
import React, { ReactElement } from 'react'
import {
  ImageStyle,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
} from 'react-native'

import { Maybe } from '@toruslabs/openlogin'

const LinkRenderer = ({
  src,
  alt,
  textStyle,
  numberOfLines,
  containerStyle,
}: {
  src: Maybe<string>
  alt?: Maybe<string>
  textStyle?: StyleProp<TextStyle>
  numberOfLines?: number
  containerStyle?: StyleProp<ImageStyle>
}): ReactElement | null => {
  if (!src) {
    return null
  }

  const fixedUrl = fixTokenUri(String(src))
  return (
    <TouchableOpacity
      onPress={(): void => {
        if (isValidHttpUrl(fixedUrl)) {
          Linking.openURL(fixedUrl)
        }
      }}
      style={containerStyle}
    >
      <Text style={[styles.text, textStyle]} numberOfLines={numberOfLines}>
        {alt || src}
      </Text>
    </TouchableOpacity>
  )
}

export default LinkRenderer

const styles = StyleSheet.create({
  text: { color: COLOR.primary._400 },
})
