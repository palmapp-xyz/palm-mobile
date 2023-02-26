import SendbirdChat from '@sendbird/chat'
import { SendbirdUIKit } from '@sendbird/uikit-react-native'

const useVersions = (): {
  chat: string
  uikit: string
} => {
  return {
    chat: SendbirdChat.version,
    uikit: SendbirdUIKit.VERSION,
  }
}

export default useVersions
