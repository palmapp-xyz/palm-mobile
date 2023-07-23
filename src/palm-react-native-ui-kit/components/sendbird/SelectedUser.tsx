import { COLOR } from 'palm-core/consts'
import { SbMemberWithSelected, SbUserWithSelected } from 'palm-core/types'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FormText from '../atoms/FormText'
import Avatar from './Avatar'

const SelectedUser = ({
  user,
}: {
  user: SbUserWithSelected | SbMemberWithSelected
}): ReactElement => {
  return (
    <View style={styles.selectedUserContainer}>
      <View>
        <Avatar uri={user.profileUrl} size={40} />
        <View style={styles.deleteUserContainer}>
          <Ionicon name="close-outline" size={12} color={COLOR.black._900} />
        </View>
      </View>
      <FormText
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.selectedUserText}
      >
        {user.nickname}
      </FormText>
    </View>
  )
}

const styles = StyleSheet.create({
  selectedUserContainer: {
    width: 64,
    alignItems: 'center',
  },
  selectedUserText: {
    marginTop: 8,
  },
  deleteUserContainer: {
    backgroundColor: COLOR.black._200,
    position: 'absolute',
    right: -4,
    top: 0,
    zIndex: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default SelectedUser
