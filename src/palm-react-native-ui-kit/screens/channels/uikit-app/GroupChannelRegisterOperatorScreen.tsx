import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect, useState } from 'react'

import { Member } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { COLOR } from 'palm-core/consts'
import { SbUserWithSelected } from 'palm-core/types'
import {
  Container,
  FormText,
  Header,
  NoResult,
  SelectedUser,
  UserCard,
  UserSearch,
} from 'palm-react-native-ui-kit/components'
import useToast from 'palm-react-native/app/useToast'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Ionicon from 'react-native-vector-icons/Ionicons'

const GroupChannelRegisterOperatorScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelRegisterOperator>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)

  const { t } = useTranslation()
  const toast = useToast()

  const [inputSearch, setInputSearch] = useState<string>('')
  const [searchProfiles, setSearchProfiles] = useState<SbUserWithSelected[]>([])
  const [selectedProfiles, setSelectedProfiles] = useState<
    SbUserWithSelected[]
  >([])

  const [members, setMembers] = useState<Member[]>([])

  const searchUsers = async (): Promise<void> => {
    if (inputSearch.length > 0) {
      const result = members.filter(profile => {
        const input = inputSearch.toLowerCase()
        const handle = profile.nickname?.toLowerCase()
        return handle?.includes(input)
      })
      setSearchProfiles(result)
    }
  }

  useEffect(() => {
    searchUsers()
  }, [inputSearch])

  useEffect(() => {
    setMembers(
      channel?.members.filter(member => member.role !== 'operator') ?? []
    )
  }, [channel?.members])

  const register = async (): Promise<void> => {
    channel
      ?.addOperators(selectedProfiles.map(profile => profile.userId))
      .then(() => {
        toast.show(t('Channels.ChannelRegisterOperatorSuccessToast'), {
          icon: 'check',
          color: 'green',
        })
        navigation.pop(4)
      })
      .catch(_ => {
        toast.show(t('Channels.ChannelRegisterOperatorFailedToast'), {
          icon: 'check',
          color: 'green',
        })
      })
  }

  if (!channel) {
    return <></>
  }

  return (
    <Container style={{ flex: 1 }}>
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
        onPressRight={register}
      />

      <View style={{ flex: 1 }}>
        <UserSearch input={inputSearch} setInput={setInputSearch} />

        {selectedProfiles.length > 0 && (
          <View style={styles.selectedProfilesContainer}>
            <FormText style={styles.selectedText}>
              <FormText font="B">{selectedProfiles.length}</FormText>
              {t('Channels.ChannelRegisterOperatorUsersAreSelected')}
            </FormText>

            <FlatList
              data={selectedProfiles}
              renderItem={({ item, index }): ReactElement => {
                return (
                  <>
                    {index === 0 && <View style={{ width: 20 }} />}
                    <TouchableWithoutFeedback
                      onPress={(): void => {
                        setSelectedProfiles(prev =>
                          prev.filter(profile => profile.userId !== item.userId)
                        )
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
            onEndReached={async (): Promise<void> => {}}
            onEndReachedThreshold={0.5}
            renderItem={({ item }): ReactElement => {
              return (
                <UserCard
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
            data={members}
            onEndReached={async (): Promise<void> => {}}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<NoResult />}
            renderItem={({ item }): ReactElement | null => {
              if (
                item.nickname === undefined ||
                item.nickname === null ||
                item.nickname === ''
              ) {
                return null
              }
              return (
                <UserCard
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

export default GroupChannelRegisterOperatorScreen
