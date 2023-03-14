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

import { SignWithLens } from '../screens'
import PostTxResult from './PostTxResult'
import MainNavigator from './MainNavigator'
import AuthNavigator from './AuthNavigator'

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
          <RootStack.Screen name={Routes.HomeTabs} component={MainNavigator} />
        ) : user ? (
          <RootStack.Screen name="SignWithLens" component={SignWithLens} />
        ) : (
          <RootStack.Screen
            name={Routes.MainAccount}
            component={AuthNavigator}
          />
        )}
      </RootStack.Navigator>
      <PostTxResult />
    </NavigationContainer>
  )
}

export default Navigation
