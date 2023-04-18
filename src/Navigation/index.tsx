import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import React, { ReactElement } from 'react'

import useAppearance from 'hooks/useAppearance'
import useAuth from 'hooks/independent/useAuth'

import { Routes, navigationRef } from 'libs/navigation'

import { SignInWithLens } from '../screens'
import PostTxResult from './PostTxResult'
import MainNavigator from './MainNavigator'
import AuthNavigator from './AuthNavigator'
import { SupportedNetworkEnum } from 'types'
import LoadingPage from 'components/atoms/LoadingPage'

const RootStack = createNativeStackNavigator()

const Navigation = (): ReactElement => {
  const { user, restoreLoading } = useAuth()
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'

  if (restoreLoading) {
    return <LoadingPage />
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={isLightTheme ? DefaultTheme : DarkTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user?.auth ? (
          user?.lensAuth !== undefined ? (
            <RootStack.Screen
              name={Routes.MainNavigator}
              component={MainNavigator}
            />
          ) : (
            <RootStack.Screen
              name="SignInWithLens"
              component={SignInWithLens}
            />
          )
        ) : (
          <RootStack.Screen
            name={Routes.AuthNavigator}
            component={AuthNavigator}
          />
        )}
      </RootStack.Navigator>
      <PostTxResult network={SupportedNetworkEnum.ETHEREUM} />
    </NavigationContainer>
  )
}

export default Navigation
