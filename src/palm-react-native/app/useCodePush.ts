import { useEffect, useState } from 'react'
import CodePush from 'react-native-code-push'

const useCodePush = (): {
  restartApp: (onlyIfUpdateIsPending?: boolean) => void
  syncUpdate: () => Promise<void>
  upToDate: boolean | undefined
  updateComplete: boolean | undefined
  progress: number
} => {
  const [upToDate, setUpToDate] = useState<boolean>()
  const [updateComplete, setUpdateComplete] = useState<boolean>()

  const [progress, setProgress] = useState(0)

  const timeout = async (ms: number): Promise<void> => {
    return await new Promise(resolve => setTimeout(resolve, ms))
  }

  useEffect(() => {
    const check = async (): Promise<void> => {
      try {
        const available = await Promise.race([
          CodePush.checkForUpdate(),
          timeout(10_000),
        ])

        if (available) {
          syncUpdate()
        } else {
          setUpToDate(true)
        }
      } catch (e) {
        setUpToDate(true)
        console.error(e)
      }
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
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          case CodePush.SyncStatus.SYNC_IN_PROGRESS:
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setUpToDate(false)
            break
          case CodePush.SyncStatus.UPDATE_IGNORED:
          case CodePush.SyncStatus.UP_TO_DATE:
            setUpToDate(true)
            break
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            setUpdateComplete(true)
            break
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            setUpToDate(true)
            break
        }
      },
      ({ receivedBytes, totalBytes }) => {
        setProgress(receivedBytes / totalBytes)
      }
    )
  }

  const restartApp = (onlyIfUpdateIsPending?: boolean): void => {
    CodePush.restartApp(onlyIfUpdateIsPending)
  }

  return {
    restartApp,
    syncUpdate,
    upToDate,
    updateComplete,
    progress,
  }
}

export default useCodePush
