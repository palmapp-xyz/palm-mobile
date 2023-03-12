import React, { ReactElement, useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'

import {
  Header,
  Icon,
  createStyleSheet,
  useHeaderStyle,
} from '@sendbird/uikit-react-native-foundation'
import {
  GroupChannelProps,
  GroupChannelContexts,
  useLocalization,
  ChannelCover,
} from '@sendbird/uikit-react-native'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import useAuth from 'hooks/independent/useAuth'
import { ContractAddr } from 'types'

const GroupChannelHeader = ({
  onPressHeaderLeft,
  onPressHeaderRight,
}: GroupChannelProps['Header']): ReactElement => {
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment)
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator)
  const { STRINGS } = useLocalization()
  const { HeaderComponent } = useHeaderStyle()
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers)
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const { user } = useAuth()

  const userId = channel.members.find(
    member => member.userId !== user?.address
  )?.userId

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={async (): Promise<void> => {
              if (!userId) {
                return
              }
              navigation.navigate(Routes.UserProfile, {
                address: userId as ContractAddr,
              })
            }}>
            <ChannelCover
              channel={channel}
              size={34}
              containerStyle={styles.avatarGroup}
            />
          </TouchableOpacity>
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>{headerTitle}</Header.Title>
            {Boolean(subtitle) && subtitle && (
              <Header.Subtitle style={styles.subtitle}>
                {subtitle}
              </Header.Subtitle>
            )}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={'info'} />}
      onPressRight={onPressHeaderRight}
    />
  )
}

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    marginRight: 8,
  },
  subtitle: {
    marginTop: 2,
  },
})

export default GroupChannelHeader
