import { useAppNavigation } from 'palm-react/hooks/app/useAppNavigation'
import React, { ReactElement, useState } from 'react'

import { FileViewer, useSendbirdChat } from '@sendbird/uikit-react-native'

import type { SendbirdFileMessage } from '@sendbird/uikit-utils'

import type { Routes } from 'palm-core/libs/navigation'

const FileViewerScreen = (): ReactElement => {
  const { sdk } = useSendbirdChat()
  const { navigation, params } = useAppNavigation<Routes.FileViewer>()
  const [fileMessage] = useState(
    () =>
      sdk.message.buildMessageFromSerializedData(
        params.serializedFileMessage
      ) as SendbirdFileMessage
  )
  return (
    <FileViewer
      fileMessage={fileMessage}
      onClose={(): void => navigation.goBack()}
      deleteMessage={params.deleteMessage}
    />
  )
}

export default FileViewerScreen
