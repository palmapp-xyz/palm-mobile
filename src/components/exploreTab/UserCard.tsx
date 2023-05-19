import images from 'assets/images'
import { Card, FormImage, FormText } from 'components'
import { UTIL } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { FbProfile } from 'types'

const UserCard = ({ user }: { user: FbProfile }): ReactElement => {
  const { navigation } = useAppNavigation()

  return (
    <Card borderRound={true}>
      <Pressable
        style={styles.userBox}
        onPress={(): void => {
          navigation.push(Routes.UserProfile, {
            profileId: user.profileId,
            address: user.address,
          })
        }}
      >
        <View style={styles.userThumb}>
          <FormImage
            source={
              user.coverPicture
                ? { uri: user.coverPicture }
                : images.blank_profile
            }
            size={72}
          />
        </View>
        <View style={{ flex: 1, rowGap: 8 }}>
          <FormText fontType="B.16" numberOfLines={1}>
            {user.handle}
          </FormText>
          <View>
            <FormText fontType="B.14">{UTIL.truncate(user.address)}</FormText>
            <FormText fontType="R.12" numberOfLines={3}>
              {user.bio}
            </FormText>
          </View>
        </View>
      </Pressable>
    </Card>
  )
}

export default UserCard

const styles = StyleSheet.create({
  userThumb: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  userBox: {
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
  },
})
