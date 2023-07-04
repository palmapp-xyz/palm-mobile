import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { Routes } from 'palm-core/libs/navigation'
import { FbProfile } from 'palm-core/types'
import { Card, FormText } from 'palm-react-native-ui-kit/components'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import { useAppNavigation } from 'palm-react/hooks/app/useAppNavigation'
import React, { ReactElement } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

const UserCard = ({ user }: { user: FbProfile }): ReactElement => {
  const { navigation } = useAppNavigation()

  return (
    <Card
      borderRound={true}
      style={{ backgroundColor: `${COLOR.black._200}${COLOR.opacity._10}` }}
    >
      <Pressable
        style={styles.userBox}
        onPress={(): void => {
          navigation.push(Routes.UserProfile, {
            profileId: user.profileId,
            address: user.address,
          })
        }}
      >
        <Avatar size={56} uri={getProfileMediaImg(user.picture)} />
        <View style={{ flex: 1, rowGap: 6 }}>
          <FormText font={'B'} size={16} numberOfLines={1}>
            {user.handle}
          </FormText>
          <View>
            <FormText style={{ marginBottom: 4 }}>
              {UTIL.truncate(user.address)}
            </FormText>
            {user.bio && user.bio.trim().length > 0 && (
              <FormText numberOfLines={3} color={COLOR.black._300}>
                {user.bio}
              </FormText>
            )}
          </View>
        </View>
      </Pressable>
    </Card>
  )
}

export default UserCard

const styles = StyleSheet.create({
  userBox: {
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
  },
})
