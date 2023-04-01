import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import React, { ReactElement, useEffect } from 'react'

import useAppearance from 'hooks/useAppearance'
import useAuth from 'hooks/independent/useAuth'

import { Routes, navigationRef } from 'libs/navigation'
import { onForegroundAndroid, onForegroundIOS } from 'libs/notification'

import { SignInWithLens } from '../screens'
import PostTxResult from './PostTxResult'
import MainNavigator from './MainNavigator'
import AuthNavigator from './AuthNavigator'
import { SupportedNetworkEnum } from 'types'

const RootStack = createNativeStackNavigator()

const Navigation = (): ReactElement => {
  const { user } = useAuth()
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'

  useEffect(() => {
    const unsubscribes = [onForegroundAndroid(), onForegroundIOS()]
    return () => {
      unsubscribes.forEach(fn => fn())
    }
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={isLightTheme ? DefaultTheme : DarkTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user?.accessToken ? (
          <RootStack.Screen
            name={Routes.MainNavigator}
            component={MainNavigator}
          />
        ) : user ? (
          <RootStack.Screen name="SignInWithLens" component={SignInWithLens} />
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
