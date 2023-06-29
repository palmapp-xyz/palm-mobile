import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { FontSize, SbUserMetadata } from 'types'

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
