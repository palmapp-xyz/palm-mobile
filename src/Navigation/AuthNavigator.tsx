import React, { ReactElement } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Routes } from '../libs/navigation'
import {
  MainAccountScreen,
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
      <AuthStack.Screen name={Routes.NewAccount} component={NewAccountScreen} />
      <AuthStack.Screen
        name={Routes.RecoverAccount}
        component={RecoverAccountScreen}
      />
    </AuthStack.Navigator>
  )
}

export default AuthNavigator
