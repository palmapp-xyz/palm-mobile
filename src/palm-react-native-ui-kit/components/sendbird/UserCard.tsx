import { ProfileMedia } from '@lens-protocol/react'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement } from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import FormHighlightText from '../atoms/FormHighlightText'
import FormText from '../atoms/FormText'
import Row from '../atoms/Row'
import Avatar from './Avatar'

const UserCard = React.memo(
  ({
    handle,
    handleHighlight,
    picture,
    showSelectedState,
    selected,
    onPress,
  }: {
    handle?: string
    handleHighlight?: string
    picture?: ProfileMedia | string
    showSelectedState?: boolean
    selected?: boolean
    onPress: () => void
  }): ReactElement => {
    const profileImg =
      typeof picture === 'string' ? picture : getProfileMediaImg(picture)

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Row style={styles.row}>
          <Avatar uri={profileImg} size={40} />
          <View style={{ flex: 1 }}>
            {handleHighlight && handleHighlight.length > 0 ? (
              <FormHighlightText
                text={handle}
                highlight={handleHighlight}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            ) : (
              <FormText numberOfLines={1} ellipsizeMode="tail">
                {handle}
              </FormText>
            )}
          </View>
          {showSelectedState && (
            <>
              {selected ? (
                <Image source={images.checkbox_on} style={styles.image} />
              ) : (
                <Image source={images.checkbox_off} style={styles.image} />
              )}
            </>
          )}
        </Row>
      </TouchableWithoutFeedback>
    )
  }
)

const styles = StyleSheet.create({
  row: {
    height: 40,
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  image: {
    width: 16,
    height: 16,
  },
})

export default UserCard
