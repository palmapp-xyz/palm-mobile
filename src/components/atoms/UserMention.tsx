import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { FontSize, FontType, SbUserMetadata } from 'types'

import FormText, { FormTextProps } from './FormText'

type UserMentionProps = {
  size?: FontSize
  userMetadata: SbUserMetadata
} & Omit<FormTextProps, 'children'>

const UserMention = ({
  size = 12,
  userMetadata,
  ...rest
}: UserMentionProps): ReactElement => {
  const { navigation } = useAppNavigation()

  return (
    <FormText
      fontType={`B.${size}` as FontType}
      onPress={(): void => {
        navigation.push(Routes.UserProfile, {
          address: userMetadata.address,
          profileId: userMetadata.profileId,
        })
      }}
      color={COLOR.user_mention}
      {...rest}
    >
      @{userMetadata.handle}
    </FormText>
  )
}

export default UserMention
