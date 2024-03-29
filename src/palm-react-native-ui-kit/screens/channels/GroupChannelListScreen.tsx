import { Routes } from 'palm-core/libs/navigation'
import { Container, FormImage, Row } from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native'
import { SendbirdGroupChannel } from '@sendbird/uikit-utils'

import GroupChannelPreviewContainer from './GroupChannelPreviewContainer'

const HEADER_HEIGHT = 72

const GroupChannelListFragment = createGroupChannelListFragment({
  Header: (): ReactElement => <></>,
})
const GroupChannelListScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelList>()

  useEffect(() => {
    setTimeout(() => {
      if (params?.channelUrl) {
        navigation.navigate(Routes.GroupChannel, {
          channelUrl: params.channelUrl,
        })
      }
    }, 500)
  }, [params?.channelUrl])

  return (
    <Container
      style={[
        styles.container,
        { marginBottom: Platform.OS === 'ios' ? -30 : 0 },
      ]}
    >
      <Row style={styles.header}>
        <FormImage source={images.palm_logo} size={44} />
        <TouchableOpacity
          onPress={(): void => {
            navigation.navigate(Routes.CreateChannel)
          }}
        >
          <FormImage source={images.create_channel} size={28} />
        </TouchableOpacity>
      </Row>
      <GroupChannelListFragment
        onPressCreateChannel={(_channelType): void => {
          navigation.navigate(Routes.GroupChannelCreate, {
            channelType: 'GROUP',
          })
        }}
        onPressChannel={(channel): void => {
          navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url })
        }}
        renderGroupChannelPreview={(
          channel: SendbirdGroupChannel,
          onLongPressChannel: () => void
        ): ReactElement | null => (
          <GroupChannelPreviewContainer
            channel={channel}
            onPress={(): void =>
              navigation.navigate(Routes.GroupChannel, {
                channelUrl: channel.url,
              })
            }
            onLongPress={onLongPressChannel}
          />
        )}
      />
    </Container>
  )
}

export default GroupChannelListScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
