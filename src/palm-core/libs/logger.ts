import crashlytics from '@react-native-firebase/crashlytics'

export const log = (message: string, ...optionalParams: any[]): void => {
  const msg: string = `${message}: ${optionalParams.join(', ')}`
  if (crashlytics().isCrashlyticsCollectionEnabled) {
    crashlytics().log(msg)
  } else {
    console.log(msg)
  }
}

export const recordError = (error: unknown, jsErrorName?: string): void => {
  if (crashlytics().isCrashlyticsCollectionEnabled) {
    crashlytics().recordError(error as Error, jsErrorName)
  } else {
    console.error(jsErrorName ?? '[Error]', error)
  }
}
