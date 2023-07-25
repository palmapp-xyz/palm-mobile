import { RestrictedUser } from '@sendbird/chat'
import {
  Container,
  FormButton,
  Header,
  NoResult,
  Title,
  UserCard,
} from 'palm-react-native-ui-kit/components'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'

const GroupChannelManageUserFragment = ({
  title,
  onBackPress,
  members,
  onConfirm,
}: {
  title: string
  onBackPress: () => void
  members: RestrictedUser[]
  onConfirm: (selectedMembers: RestrictedUser[]) => void
}): ReactElement => {
  const { t } = useTranslation()

  const [isManageList, setIsManageList] = useState<boolean>(false)
  const [selectedMembers, setSelectedMembers] = useState<RestrictedUser[]>([])

  const onPressItem = (item: RestrictedUser): void => {
    if (isManageList) {
      selectedMembers.includes(item)
        ? setSelectedMembers(prev => prev.filter(profile => profile !== item))
        : setSelectedMembers([...selectedMembers, item])
    }
  }

  return (
    <Container style={{ flex: 1 }}>
      <Header left={'back'} onPressLeft={onBackPress} />
      <Title title={title} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={members}
          ListEmptyComponent={<NoResult />}
          renderItem={({ item }): ReactElement => {
            return (
              <View style={{ marginTop: 16 }}>
                <UserCard
                  handle={item.nickname}
                  picture={item.profileUrl}
                  onPress={(): void => {
                    onPressItem(item)
                  }}
                  showSelectedState={isManageList}
                  selected={selectedMembers.includes(item)}
                />
              </View>
            )
          }}
        />
      </View>
      <FormButton
        font="SB"
        figure={isManageList ? 'primary' : 'outline'}
        onPress={(): void => {
          if (isManageList && selectedMembers.length > 0) {
            onConfirm(selectedMembers)
          }
          setSelectedMembers([])
          setIsManageList(prev => !prev)
        }}
        containerStyle={{ marginHorizontal: 20 }}
      >
        {isManageList
          ? t('GroupChannelManageUser.RemoveFromTheList')
          : t('GroupChannelManageUser.ManageList')}
      </FormButton>
    </Container>
  )
}

export default GroupChannelManageUserFragment
