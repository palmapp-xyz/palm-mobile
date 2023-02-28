import React, { ReactElement } from 'react'

import FileMessage, {
  FileMessageProps,
} from '@sendbird/uikit-react-native/src/components/MessageRenderer/FileMessage'
import { MediaRenderer } from './MediaRenderer'

const NftMessage = (props: FileMessageProps): ReactElement => {
  const fileType = props.message.customType
  if (fileType === 'share') {
    return <MediaRenderer src={props.message.data} width={200} height={200} />
  }
  return <FileMessage {...props} />
}

export default React.memo(NftMessage)
