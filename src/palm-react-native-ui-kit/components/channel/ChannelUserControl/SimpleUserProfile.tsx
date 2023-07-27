import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { FbProfile } from 'palm-core/types'
import { FormText } from 'palm-react-native-ui-kit/components'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

const SimpleUserProfile = React.memo(
  ({ profile }: { profile?: FbProfile }): ReactElement => {
    const profileImg = getProfileMediaImg(profile?.picture)

    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <View style={styles.avatar}>
            <Avatar uri={profileImg} size={56} />
          </View>
        </View>
        <View style={styles.bottomView}>
          <FormText font="B" size={20} color={COLOR.black._900}>
            {profile?.handle}
          </FormText>
          <FormText
            color={COLOR.black._300}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {profile?.bio}
          </FormText>
        </View>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.black._90010,
    marginBottom: 20,
  },
  topView: {
    backgroundColor: COLOR.black._90005,
    height: 80,
  },
  bottomView: {
    margin: 20,
  },
  avatar: {
    position: 'absolute',
    left: 20,
    bottom: -12,
  },
})

export default SimpleUserProfile
