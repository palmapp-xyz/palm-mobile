import images from 'assets/images'
import { FormImage, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import {
  GroupChannelContexts,
  GroupChannelProps,
  useLocalization,
} from '@sendbird/uikit-react-native'
import {
  createStyleSheet,
  Header,
  useHeaderStyle,
} from '@sendbird/uikit-react-native-foundation'

const GroupChannelHeader = ({
  onPressHeaderLeft,
}: GroupChannelProps['Header']): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()
  const { headerTitle } = useContext(GroupChannelContexts.Fragment)
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator)
  const { STRINGS } = useLocalization()
  const { HeaderComponent } = useHeaderStyle()
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers)

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
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
      right={
        <Row style={{ columnGap: 16 }}>
          <TouchableOpacity
            onPress={(): void => {
              navigation.navigate(Routes.ChannelListings, params)
            }}
          >
            <FormImage source={images.NFT_black} size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(): void => {
              navigation.navigate(Routes.ChannelInfo, params)
            }}
          >
            <Icon name="menu-outline" size={28} />
          </TouchableOpacity>
        </Row>
      }
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
