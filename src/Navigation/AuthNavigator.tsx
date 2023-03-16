import React, { ReactElement } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Routes } from '../libs/navigation'
import {
  MainAccountScreen,
  AuthLoginScreen,
  AuthMenuScreen,
  NewAccountScreen,
  RecoverAccountScreen,
} from '../screens'

const AuthStack = createNativeStackNavigator()

const AuthNavigator = (): ReactElement => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name={Routes.MainAccount}
        component={MainAccountScreen}
      />
      <AuthStack.Screen
        name={Routes.AuthMenu}
        component={AuthMenuScreen}
        options={{ presentation: 'transparentModal' }}
      />
      <AuthStack.Screen
        name={Routes.Login}
        component={AuthLoginScreen}
        options={{ presentation: 'transparentModal' }}
      />
      <AuthStack.Screen
        name={Routes.NewAccount}
        component={NewAccountScreen}
        options={{ presentation: 'transparentModal' }}
      />
      <AuthStack.Screen
        name={Routes.RecoverAccount}
        component={RecoverAccountScreen}
        options={{ presentation: 'transparentModal' }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthNavigator
