import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
  ConfirmSeedScreen,
  CreateCompleteScreen,
  MainAccountScreen,
  NewAccountScreen,
  PinScreen,
  RecoverAccountScreen,
  Sign4AuthScreen,
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
        name={Routes.ConfirmSeed}
        component={ConfirmSeedScreen}
      />
      <AuthStack.Screen
        name={Routes.CreateComplete}
        component={CreateCompleteScreen}
      />
      <AuthStack.Screen
        name={Routes.RecoverAccount}
        component={RecoverAccountScreen}
      />
      <AuthStack.Screen name={Routes.Pin} component={PinScreen} />
      <AuthStack.Screen name={Routes.Sign4Auth} component={Sign4AuthScreen} />
    </AuthStack.Navigator>
  )
}

export default AuthNavigator
