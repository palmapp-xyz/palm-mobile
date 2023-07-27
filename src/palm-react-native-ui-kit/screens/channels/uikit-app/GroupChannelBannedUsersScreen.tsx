import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { BannedUserListQuery, RestrictedUser } from '@sendbird/chat'
import type { Routes } from 'palm-core/libs/navigation'
import useToast from 'palm-react-native/app/useToast'
import { useTranslation } from 'react-i18next'
import GroupChannelManageUserFragment from '../GroupChannelManageUserFragment'

const GroupChannelBannedUsersScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelBannedUsers>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const toast = useToast()
  const { t } = useTranslation()

  const [bannedMembers, setBannedMembers] = useState<RestrictedUser[]>([])

  const queryRef = useRef<BannedUserListQuery>()

  const onConfirm = (selectedMembers: RestrictedUser[]): void => {
    Promise.all(
      selectedMembers.map(member => {
        channel?.unbanUserWithUserId(member.userId)
      })
    )
      .then(() => {
        toast.show(t('GroupChannelManageUser.SuccessToast'), {
          icon: 'check',
          color: 'green',
        })
      })
      .catch(_ => {
        toast.show(t('GroupChannelManageUser.FailedToast'), {
          icon: 'check',
          color: 'green',
        })
      })
    setBannedMembers(prev =>
      prev.filter(member => !selectedMembers.includes(member))
    )
  }

  const fetch = async (): Promise<void> => {
    if (queryRef.current && queryRef.current.hasNext) {
      const users = await queryRef.current.next()
      setBannedMembers(prev => [...prev, ...users])
    }
  }

  useEffect(() => {
    if (channel) {
      queryRef.current = channel?.createBannedUserListQuery({ limit: 20 })
      fetch()
    }
  }, [channel])

  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelManageUserFragment
      title={t('GroupChannelManageUser.BannedMembersTitle')}
      onBackPress={(): void => {
        navigation.goBack()
      }}
      members={bannedMembers}
      onConfirm={onConfirm}
    />
  )
}

export default GroupChannelBannedUsersScreen
