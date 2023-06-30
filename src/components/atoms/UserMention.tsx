import { COLOR } from 'core/consts'
import { Routes } from 'core/libs/navigation'
import { FontSize, SbUserMetadata } from 'core/types'
import { useAppNavigation } from 'hooks/useAppNavigation'
import React, { ReactElement } from 'react'

import { useLocalization } from '@sendbird/uikit-react-native'

import FormText, { FormTextProps } from './FormText'

type UserMentionProps = {
  size?: FontSize
  userMetadata: SbUserMetadata
} & Omit<FormTextProps, 'children'>

const UserMention = ({
  size = 14,
  userMetadata,
  ...rest
}: UserMentionProps): ReactElement => {
  const { navigation } = useAppNavigation()
  const { STRINGS } = useLocalization()

  return (
    <FormText
      size={size}
      font={'B'}
      onPress={(): void => {
        navigation.push(Routes.UserProfile, {
          address: userMetadata.address,
          profileId: userMetadata.profileId,
        })
      }}
      color={COLOR.user_mention}
      {...rest}
    >
      @{userMetadata?.handle ?? STRINGS.LABELS.USER_NO_NAME}
    </FormText>
  )
}

export default UserMention
