import { useEffect, useState } from 'react'
import CodePush from 'react-native-code-push'

const useCodePush = (): {
  restartApp: (onlyIfUpdateIsPending?: boolean) => void
  syncUpdate: () => Promise<void>
  updateAvailable: boolean | undefined
  updateComplete: boolean | undefined
} => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>()
  const [updateComplete, setUpdateComplete] = useState<boolean>()

  useEffect(() => {
    const check = async (): Promise<void> => {
      const available = await CodePush.checkForUpdate()
      console.log('updateAvailable', available)
      setUpdateAvailable(available ? true : false)
    }

    check()
  }, [])

  const syncUpdate = async (): Promise<void> => {
    CodePush.sync(
      {
        updateDialog: undefined,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
          case CodePush.SyncStatus.UP_TO_DATE:
            console.log('UP_TO_DATE')
            setUpdateAvailable(false)
            break
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            console.log('UPDATE_INSTALLED')
            setUpdateComplete(true)
            // CodePush.allowRestart()
            break
        }
      }
    )
  }

  const restartApp = (onlyIfUpdateIsPending?: boolean): void => {
    setTimeout(() => {
      CodePush.restartApp(onlyIfUpdateIsPending)
    }, 1000)
  }

  return {
    restartApp,
    syncUpdate,
    updateAvailable,
    updateComplete,
  }
}

export default useCodePush
