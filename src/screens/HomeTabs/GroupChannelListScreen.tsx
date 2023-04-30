import images from 'assets/images'
import { Container, FormImage, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native'

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
    <Container style={styles.container}>
      <Row style={styles.header}>
        <FormImage source={images.palm_logo} size={44} />
        <TouchableOpacity
          onPress={(): void => {
            navigation.navigate(Routes.CreateChannel)
          }}>
          <FormImage source={images.create_channel} size={28} />
        </TouchableOpacity>
      </Row>
      <GroupChannelListFragment
        onPressCreateChannel={(channelType): void => {
          navigation.navigate(Routes.GroupChannelCreate, { channelType })
        }}
        onPressChannel={(channel): void => {
          navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url })
        }}
      />
    </Container>
  )
}

export default GroupChannelListScreen

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: -30 },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
