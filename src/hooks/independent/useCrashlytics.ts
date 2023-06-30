import { log } from 'core/libs/logger'
import useAuth from 'hooks/auth/useAuth'
import { useEffect } from 'react'

import crashlytics from '@react-native-firebase/crashlytics'

const useCrashlytics = (): void => {
  const { user } = useAuth()

  useEffect(() => {
    crashlytics().setCrashlyticsCollectionEnabled(
      process.env.NODE_ENV === 'production'
    )
  }, [])

  useEffect(() => {
    if (!user?.auth?.profileId) {
      return
    }

    Promise.all([
      crashlytics().setUserId(user?.auth?.profileId),
      crashlytics().setAttribute('address', user.address),
    ])

    log(
      'Crashlytics attributes set for user',
      user.auth?.profileId,
      user.address
    )
  }, [user?.auth?.profileId])
}

export default useCrashlytics
