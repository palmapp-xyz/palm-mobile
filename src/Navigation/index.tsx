import LoadingPage from 'components/atoms/LoadingPage'
import { navigationRef, Routes } from 'core/libs/navigation'
import useAuth from 'hooks/auth/useAuth'
import useCrashlytics from 'hooks/independent/useCrashlytics'
import useAppearance from 'hooks/useAppearance'
import React, { ReactElement } from 'react'

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignInWithLens } from '../screens'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import PostTxResult from './PostTxResult'

const RootStack = createNativeStackNavigator()

const Navigation = (): ReactElement => {
  const { user, restoreLoading } = useAuth()
  useCrashlytics()
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'

  if (restoreLoading) {
    return <LoadingPage />
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={isLightTheme ? DefaultTheme : DarkTheme}
    >
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
      <PostTxResult />
    </NavigationContainer>
  )
}

export default Navigation
