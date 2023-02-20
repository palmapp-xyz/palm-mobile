import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement, useContext, useState } from 'react'
import { Appearance } from 'react-native'

import { NOOP, useAsyncLayoutEffect } from '@sendbird/uikit-utils'

const DEFAULT_APPEARANCE = 'light'

const AppearanceContext = createContext<{
  scheme: 'light' | 'dark'
  setScheme: (val: 'light' | 'dark') => void
}>({
  scheme: DEFAULT_APPEARANCE,
  setScheme: NOOP,
})

const SchemeManager = {
  KEY: 'sendbird@scheme',
  async get(): Promise<'light' | 'dark'> {
    return ((await AsyncStorage.getItem(SchemeManager.KEY)) ??
      Appearance.getColorScheme() ??
      DEFAULT_APPEARANCE) as 'light' | 'dark'
  },
  async set(scheme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(SchemeManager.KEY, scheme)
  },
}

export const AppearanceProvider = ({
  children,
}: React.PropsWithChildren<unknown>): ReactElement => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() ?? DEFAULT_APPEARANCE
  )

  useAsyncLayoutEffect(async () => {
    setScheme(await SchemeManager.get())
  }, [])

  // Handle scheme from Settings screen.
  // useEffect(() => {
  //   const unsubscribe = Appearance.addChangeListener(({ colorScheme }) => setScheme(colorScheme ?? DEFAULT_APPEARANCE));
  //   return () => unsubscribe.remove();
  // }, []);

  return (
    <AppearanceContext.Provider
      value={{
        scheme,
        setScheme: async (value): Promise<void> => {
          setScheme(value)
          await SchemeManager.set(value)
        },
      }}>
      {children}
    </AppearanceContext.Provider>
  )
}

const useAppearance = (): {
  scheme: 'light' | 'dark'
  setScheme: (val: 'light' | 'dark') => void
} => {
  return useContext(AppearanceContext)
}

export const withAppearance = (Component: (props: object) => JSX.Element) => {
  return (props: object): ReactElement => (
    <AppearanceProvider>
      <Component {...props} />
    </AppearanceProvider>
  )
}

export default useAppearance
