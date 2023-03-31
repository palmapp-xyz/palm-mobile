import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import {
  Header,
  createStyleSheet,
  useHeaderStyle,
} from '@sendbird/uikit-react-native-foundation'
import {
  GroupChannelProps,
  GroupChannelContexts,
  useLocalization,
} from '@sendbird/uikit-react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { FormText } from 'components'

const GroupChannelHeader = ({
  onPressHeaderLeft,
  onPressHeaderRight,
}: GroupChannelProps['Header']): ReactElement => {
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment)
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator)
  const { STRINGS } = useLocalization()
  const { HeaderComponent } = useHeaderStyle()
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers)

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <FormText fontType="B.18">{channel.coverUrl}</FormText>
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
      left={<Icon name="chevron-back-outline" size={28} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon name="menu-outline" size={28} />}
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
