import { navigationRef, Routes } from 'palm-core/libs/navigation'
import LoadingPage from 'palm-react-native-ui-kit/components/atoms/LoadingPage'
import PostTxResult from 'palm-react-native-ui-kit/components/PostTxResult'
import useAppearance from 'palm-react-native/app/useAppearance'
import useCrashlytics from 'palm-react-native/app/useCrashlytics'
import useAuth from 'palm-react/hooks/auth/useAuth'
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
