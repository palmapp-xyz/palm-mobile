import {
  FormText,
  ViewHorizontalDivider,
} from 'palm-react-native-ui-kit/components'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

const UserControlItem = ({
  text,
  onPress,
}: {
  text: string
  onPress: () => void
}): ReactElement => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.itemContainer}>
      <FormText style={styles.itemText}>{text}</FormText>
    </View>
  </TouchableOpacity>
)

const UserControlMenu = React.memo(
  ({
    setSelected,
    setShowChannelUserControl,
  }: {
    setSelected: React.Dispatch<
      React.SetStateAction<'ban' | 'mute' | undefined>
    >
    setShowChannelUserControl: React.Dispatch<React.SetStateAction<boolean>>
  }): ReactElement => {
    const { t } = useTranslation()

    return (
      <View>
        <UserControlItem
          text={t('UserProfile.MuteThisUserTitle')}
          onPress={(): void => {
            setSelected('mute')
          }}
        />
        <ViewHorizontalDivider />
        <UserControlItem
          text={t('UserProfile.BanThisUserTitle')}
          onPress={(): void => {
            setSelected('ban')
          }}
        />
        <ViewHorizontalDivider height={12} />
        <UserControlItem
          text={t('Common.Cancel')}
          onPress={(): void => {
            setShowChannelUserControl(false)
          }}
        />
      </View>
    )
  }
)

const styles = StyleSheet.create({
  itemContainer: {
    height: 44,
    marginVertical: 4,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  itemText: {
    lineHeight: 18,
  },
})

export default UserControlMenu
