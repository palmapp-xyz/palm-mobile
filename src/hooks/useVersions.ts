import SendbirdChat from '@sendbird/chat'
import { SendbirdUIKit } from '@sendbird/uikit-react-native'
import { useEffect, useState } from 'react'
import CodePush from 'react-native-code-push'
import DeviceInfo from 'react-native-device-info'

const useVersions = (): {
  chat: string
  uikit: string
  app: string
  codepush?: string
} => {
  const [codepushVersion, setCodepushVersion] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    CodePush.getUpdateMetadata().then(localPackage => {
      localPackage?.label && setCodepushVersion(localPackage?.label.slice(1))
    })
  }, [])

  return {
    chat: SendbirdChat.version,
    uikit: SendbirdUIKit.VERSION,
    app: DeviceInfo.getVersion(),
    codepush: codepushVersion,
  }
}

export default useVersions
