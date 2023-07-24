import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { MutedUserListQuery, RestrictedUser } from '@sendbird/chat'
import type { Routes } from 'palm-core/libs/navigation'
import useToast from 'palm-react-native/app/useToast'
import { useTranslation } from 'react-i18next'
import GroupChannelManageUserFragment from '../GroupChannelManageUserFragment'

const GroupChannelMutedMembersScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelMutedMembers>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const toast = useToast()
  const { t } = useTranslation()

  const [mutedMembers, setMutedMembers] = useState<RestrictedUser[]>([])

  const queryRef = useRef<MutedUserListQuery>()

  const onConfirm = (selectedMembers: RestrictedUser[]): void => {
    Promise.all(
      selectedMembers.map(member => {
        channel?.unmuteUserWithUserId(member.userId)
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
    setMutedMembers(prev =>
      prev.filter(member => !selectedMembers.includes(member))
    )
  }

  const fetch = async (): Promise<void> => {
    if (queryRef.current && queryRef.current.hasNext) {
      const users = await queryRef.current.next()
      setMutedMembers(prev => [...prev, ...users])
    }
  }

  useEffect(() => {
    if (channel) {
      queryRef.current = channel?.createMutedUserListQuery({ limit: 20 })
      fetch()
    }
  }, [channel])

  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelManageUserFragment
      title={t('GroupChannelManageUser.MutedMembersTitle')}
      onBackPress={(): void => {
        navigation.goBack()
      }}
      members={mutedMembers}
      onConfirm={onConfirm}
    />
  )
}

export default GroupChannelMutedMembersScreen
