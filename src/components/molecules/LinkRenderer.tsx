import { COLOR } from 'core/consts'
import { UTIL } from 'core/libs'
import { fixTokenUri } from 'core/libs/ipfs'
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
        if (UTIL.isValidHttpUrl(fixedUrl)) {
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
