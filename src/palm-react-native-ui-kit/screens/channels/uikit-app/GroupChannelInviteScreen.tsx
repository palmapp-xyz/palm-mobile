import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect, useState } from 'react'

import { ProfileMedia } from '@lens-protocol/react'
import { User } from '@sendbird/chat'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import {
  Container,
  FormHighlightText,
  FormInput,
  FormText,
  Header,
  Row,
} from 'palm-react-native-ui-kit/components'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import useToast from 'palm-react-native/app/useToast'
import { useUserList } from 'palm-react/hooks/sendbird/useUserList'
import images from 'palm-ui-kit/assets/images'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Ionicon from 'react-native-vector-icons/Ionicons'

type UserWithSelected = User & { selected?: boolean }

const InviteUserCard = React.memo(
  ({
    handle,
    handleHighlight,
    picture,
    selected,
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
        <Row style={inviteUserCardStyles.row}>
          <Avatar uri={profileImg} size={40} />
          <View style={{ flex: 1 }}>
            {handleHighlight && handleHighlight.length > 0 ? (
              <FormHighlightText
                text={handle}
                highlight={handleHighlight}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            ) : (
              <FormText numberOfLines={1} ellipsizeMode="tail">
                {handle}
              </FormText>
            )}
          </View>
          {selected ? (
            <Image
              source={images.checkbox_on}
              style={inviteUserCardStyles.image}
            />
          ) : (
            <Image
              source={images.checkbox_off}
              style={inviteUserCardStyles.image}
            />
          )}
        </Row>
      </TouchableWithoutFeedback>
    )
  }
)

const inviteUserCardStyles = StyleSheet.create({
  row: {
    height: 40,
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  image: {
    width: 16,
    height: 16,
  },
})

const UserSearch = ({
  input,
  setInput,
}: {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}): ReactElement => {
  const { t } = useTranslation()

  return (
    <View style={{ marginHorizontal: 20 }}>
      <FormInput
        placeholder={t('Channels.ChannelInviteSearchPlaceholder')}
        maxLength={20}
        value={input}
        onChangeText={setInput}
        returnKeyType="search"
        style={{ marginVertical: 12 }}
      />
      {input.length > 0 && (
        <View style={userSearchStyles.clear}>
          <TouchableOpacity
            onPress={(): void => {
              setInput('')
            }}
          >
            <Ionicon name="close-outline" size={20} color={COLOR.black._300} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const userSearchStyles = StyleSheet.create({
  clear: {
    position: 'absolute',
    right: 10,
    top: 22,
    justifyContent: 'center',
    zIndex: 1,
  },
})

const SelectedUser = ({ user }: { user: UserWithSelected }): ReactElement => {
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

const GroupChannelInviteScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)

  const { users, hasNext, next } = useUserList(sdk)

  const { t } = useTranslation()
  const toast = useToast()

  // const [nextDocument, setNextDocument] =
  //   useState<QueryDocumentSnapshot<DocumentData>>()

  const [inputSearch, setInputSearch] = useState<string>('')
  const [searchProfiles, setSearchProfiles] = useState<UserWithSelected[]>([])
  const [selectedProfiles, setSelectedProfiles] = useState<UserWithSelected[]>(
    []
  )

  const fetchUsers = async (): Promise<void> => {
    try {
      next()
    } catch (e) {
      console.error(e)
    }
  }

  const searchUsers = async (): Promise<void> => {
    if (inputSearch.length > 0) {
      const result = users.filter(profile => {
        const input = inputSearch.toLowerCase()
        const handle = profile.nickname?.toLowerCase()
        return handle?.includes(input)
      })
      setSearchProfiles(result)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    searchUsers()
  }, [inputSearch])

  if (!channel) {
    return <></>
  }

  const inviteUsers = (): void => {
    channel
      .inviteWithUserIds(selectedProfiles.map(profile => profile.userId))
      .then(() => {
        navigation.pop(2)
      })
      .catch(e => {
        toast.show(t('Channels.ChannelInviteFailToast'), {
          icon: 'info',
          color: 'red',
        })
        console.error(e)
      })
  }

  return (
    <Container style={{ flex: 1 }} keyboardAvoiding={true}>
      <Header
        left={'close'}
        onPressLeft={(): void => {
          navigation.goBack()
        }}
        right={
          <Ionicon
            name="ios-checkmark-circle"
            color={
              selectedProfiles.length > 0
                ? COLOR.primary._400
                : COLOR.black._400
            }
            size={36}
          />
        }
        onPressRight={inviteUsers}
      />
      <View style={{ flex: 1 }}>
        <UserSearch input={inputSearch} setInput={setInputSearch} />

        {selectedProfiles.length > 0 && (
          <View style={styles.selectedProfilesContainer}>
            <FormText style={styles.selectedText}>
              <FormText font="B">{selectedProfiles.length}</FormText>
              {t('Channels.ChannelInviteUsersAreSelected')}
            </FormText>

            <FlatList
              data={selectedProfiles}
              renderItem={({ item, index }): ReactElement => {
                return (
                  <>
                    {index === 0 && <View style={{ width: 20 }} />}
                    <TouchableWithoutFeedback
                      onPress={(): void => {
                        const filteredProfiles = selectedProfiles.filter(
                          profile => profile.userId !== item.userId
                        )
                        setSelectedProfiles(filteredProfiles)
                      }}
                    >
                      <SelectedUser user={item} />
                    </TouchableWithoutFeedback>
                    {index - 1 === selectedProfiles.length && (
                      <View style={{ width: 20 }} />
                    )}
                  </>
                )
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {inputSearch.length > 0 ? (
          <FlatList
            data={searchProfiles}
            onEndReached={async (): Promise<void> => {
              hasNext && (await fetchUsers())
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }): ReactElement => {
              return (
                <InviteUserCard
                  handle={item.nickname}
                  handleHighlight={inputSearch}
                  picture={item.profileUrl}
                  selected={selectedProfiles.includes(item)}
                  onPress={(): void => {
                    selectedProfiles.includes(item)
                      ? setSelectedProfiles(
                          selectedProfiles.filter(profile => profile !== item)
                        )
                      : setSelectedProfiles([...selectedProfiles, item])
                  }}
                />
              )
            }}
          />
        ) : (
          <FlatList
            data={users}
            onEndReached={async (): Promise<void> => {
              hasNext && (await fetchUsers())
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }): ReactElement | null => {
              if (_.isEmpty(item.nickname)) {
                return null
              }
              return (
                <InviteUserCard
                  handle={item.nickname}
                  picture={item.profileUrl}
                  selected={selectedProfiles.includes(item)}
                  onPress={(): void => {
                    selectedProfiles.includes(item)
                      ? setSelectedProfiles(
                          selectedProfiles.filter(profile => profile !== item)
                        )
                      : setSelectedProfiles([...selectedProfiles, item])
                  }}
                />
              )
            }}
          />
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  selectedProfilesContainer: {
    paddingVertical: 16,
    backgroundColor: COLOR.black._90005,
  },
  selectedText: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
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

export default GroupChannelInviteScreen
