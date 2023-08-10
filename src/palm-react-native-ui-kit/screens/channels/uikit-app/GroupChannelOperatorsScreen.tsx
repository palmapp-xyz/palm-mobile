import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

import { ProfileMedia } from '@lens-protocol/react'
import { Member } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import {
  BalloonMessage,
  Container,
  FormButton,
  FormText,
  Header,
  Row,
  Title,
} from 'palm-react-native-ui-kit/components'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import useToast from 'palm-react-native/app/useToast'
import { useTranslation } from 'react-i18next'
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'

const OperatorUserCard = React.memo(
  ({
    handle,
    picture,
    onPress,
  }: {
    handle?: string
    handleHighlight?: string
    picture?: ProfileMedia | string
    selected?: boolean
    onPress: () => void
  }): ReactElement => {
    const profileImg =
      typeof picture === 'string' ? picture : getProfileMediaImg(picture)

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Row style={styles.operatorUserCardRow}>
          <Avatar uri={profileImg} size={40} />
          <View style={{ flex: 1 }}>
            <FormText numberOfLines={1} ellipsizeMode="tail">
              {handle}
            </FormText>
          </View>
        </Row>
      </TouchableWithoutFeedback>
    )
  }
)

const GroupChannelOperatorsScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelOperators>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const toast = useToast()
  const { t } = useTranslation()

  const [operators, setOperators] = useState<Member[]>([])

  const rowRefs = useRef<{ [userId: string]: Swipeable | null }[]>([])
  const [currentRow, setCurrentRow] = useState<Member>()

  const getOperators = (): void => {
    setOperators(
      channel?.members.filter(member => member.role === 'operator') ?? []
    )
  }

  useEffect(() => {
    getOperators()
  }, [channel?.members])

  if (!channel) {
    return <></>
  }

  const renderRightActions = (progress): ReactElement => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [128, 0],
      extrapolate: 'clamp',
    })

    const removeOperator = (): void => {
      currentRow &&
        channel
          .removeOperators([currentRow.userId])
          .then(() => {
            setOperators(prev =>
              prev.filter(i => i.userId !== currentRow.userId)
            )

            toast.show(t('Channels.ChannelOperatorsRemoveSuccessToast'), {
              icon: 'check',
              color: 'green',
            })
          })
          .catch(_ => {
            toast.show(t('Channels.ChannelOperatorsRemoveFailedToast'), {
              icon: 'info',
              color: 'red',
            })
          })
    }

    return (
      <View style={{ width: 80, flexDirection: 'row' }}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton
            style={[
              {
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80,
                height: '100%',
              },
            ]}
            onPress={removeOperator}
          >
            <FormText color={COLOR.white}>{'Remove'}</FormText>
          </RectButton>
        </Animated.View>
      </View>
    )
  }

  const onSiwpeableWillOpen = (item: Member): void => {
    Object.keys(rowRefs.current).forEach(id => {
      if (item.userId !== id) {
        rowRefs.current[id]?.close()
      }
    })
  }

  return (
    <Container style={{ flex: 1 }}>
      <Header left={'back'} onPressLeft={(): void => navigation.goBack()} />
      <Title title={t('Channels.ChannelOperatorsTitle')} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={operators}
          ListFooterComponent={
            <View style={styles.listFooterContainer}>
              <BalloonMessage
                text="Swipe left to remove an operator"
                showOnceKey="operator"
              />
            </View>
          }
          renderItem={({ item }): ReactElement => {
            return (
              <Swipeable
                ref={(ref): void => {
                  rowRefs.current[item.userId] = ref
                }}
                containerStyle={styles.listItemContainer}
                renderRightActions={(progress): ReactElement | null => {
                  if (sdk.currentUser.userId === item.userId) {
                    return null
                  } else {
                    return renderRightActions(progress)
                  }
                }}
                onSwipeableWillOpen={(): void => {
                  onSiwpeableWillOpen(item)
                }}
                onSwipeableOpen={(): void => {
                  setCurrentRow(item)
                }}
                childrenContainerStyle={{ flex: 1 }}
              >
                <OperatorUserCard
                  handle={item.nickname}
                  picture={item.profileUrl}
                  onPress={(): void => {
                    // do nothing
                  }}
                />
              </Swipeable>
            )
          }}
        />
        <FormButton
          font="SB"
          figure="outline"
          onPress={(): void => {
            navigation.navigate(Routes.GroupChannelRegisterOperator, {
              channelUrl: params.channelUrl,
            })
          }}
          containerStyle={{
            marginHorizontal: 20,
            marginBottom: Platform.select({ android: 20 }),
          }}
        >
          {t('Channels.ChannelOperatorsAddOperators')}
        </FormButton>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  listItemContainer: { marginTop: 16, paddingHorizontal: 20 },
  listFooterContainer: { height: 60, marginHorizontal: 20 },
  operatorUserCardRow: {
    height: 40,
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
})

export default GroupChannelOperatorsScreen
