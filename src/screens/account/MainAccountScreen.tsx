import React, { ReactElement, useEffect } from 'react'
import { ImageBackground } from 'react-native'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import images from 'assets/images'
import { useQuery } from 'react-query'
import { KeyChainEnum } from 'types'
import { getPkeyPwd } from 'libs/account'

const MainAccountScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const { data: hasStoredKey = false, isLoading } = useQuery(
    [KeyChainEnum.PK_PWD],
    async () => {
      const somePwd = await getPkeyPwd()
      return !!somePwd
    }
  )

  useEffect(() => {
    if (isLoading === false) {
      hasStoredKey
        ? navigation.navigate(Routes.Login)
        : navigation.navigate(Routes.AuthMenu)
    }
  }, [isLoading])

  return (
    <ImageBackground
      source={images.splash}
      style={{ flex: 1, marginBottom: -5 }}
    />
  )
}

export default MainAccountScreen
