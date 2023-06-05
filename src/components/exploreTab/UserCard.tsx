import { Card, FormText } from 'components'
import Avatar from 'components/sendbird/Avatar'
import { COLOR, UTIL } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getProfileMediaImg } from 'libs/lens'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { FbProfile } from 'types'

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
          <FormText fontType="B.16" numberOfLines={1}>
            {user.handle}
          </FormText>
          <View>
            <FormText fontType="R.14" style={{ marginBottom: 4 }}>
              {UTIL.truncate(user.address)}
            </FormText>
            <FormText
              fontType="R.12"
              numberOfLines={3}
              color={COLOR.black._300}
            >
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
  userBox: {
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
  },
})
