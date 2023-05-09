import { Container, FormText, Header } from 'components'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { Switch } from '@sendbird/uikit-react-native-foundation'

const ChannelSettingScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelSetting>()
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const [isFrozen, setIsFrozen] = useState(() => channel?.isFrozen || false)

  if (!channel) {
    return <></>
  }

  const toggleFreeze = async (): Promise<void> => {
    if (channel.isFrozen) {
      await channel.unfreeze()
    } else {
      await channel.freeze()
    }

    setIsFrozen(channel.isFrozen)
  }

  return (
    <Container
      style={styles.container}
      safeAreaBackgroundColor={COLOR.black._10}
    >
      <Header
        left="back"
        onPressLeft={navigation.goBack}
        containerStyle={{ backgroundColor: COLOR.black._10 }}
      />
      <View style={styles.sectionTitle}>
        <FormText fontType="B.12" color={COLOR.black._400}>
          Token Gating
        </FormText>
      </View>
      <View style={{ paddingBottom: 12 }}>
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={(): void => {
            navigation.navigate(
              channel.myRole === 'operator'
                ? Routes.EditChannel
                : Routes.ChannelInfo,
              params
            )
          }}
        >
          <FormText>
            {channel.myRole === 'operator' ? 'Edit ' : ''}Chat Room Profile
          </FormText>
          <Icon name="ios-chevron-forward" color={COLOR.black._300} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionTitle}>
        <FormText fontType="B.12" color={COLOR.black._400}>
          Moderation
        </FormText>
      </View>
      <View style={{ rowGap: 2 }}>
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={(): void => {
            navigation.push(Routes.GroupChannelOperators, params)
          }}
        >
          <FormText>Operators</FormText>
          <Icon name="ios-chevron-forward" color={COLOR.black._300} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={(): void => {
            navigation.push(Routes.GroupChannelMutedMembers, params)
          }}
        >
          <FormText>Muted Members</FormText>
          <Icon name="ios-chevron-forward" color={COLOR.black._300} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={(): void => {
            navigation.push(Routes.GroupChannelBannedUsers, params)
          }}
        >
          <FormText>Banned Users</FormText>
          <Icon name="ios-chevron-forward" color={COLOR.black._300} size={20} />
        </TouchableOpacity>
        <View style={styles.menuItemRow}>
          <FormText>Freeze Chat room</FormText>
          <Switch value={isFrozen} onChangeValue={toggleFreeze} />
        </View>
      </View>
    </Container>
  )
}

export default ChannelSettingScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.black._10 },
  sectionTitle: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  menuItemRow: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
