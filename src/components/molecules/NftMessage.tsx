import React, { ReactElement } from 'react'

import FileMessage, {
  FileMessageProps,
} from '@sendbird/uikit-react-native/src/components/MessageRenderer/FileMessage'
import { MediaRenderer } from './MediaRenderer'

const NftMessage = (props: FileMessageProps): ReactElement => {
  const fileType = props.message.customType
  if (fileType === 'share') {
    return <MediaRenderer src={props.message.data} width={200} height={200} />
  } else if (fileType === 'sell') {
    return <MediaRenderer src={props.message.data} width={300} height={300} />
  } else if (fileType === 'send') {
    return <MediaRenderer src={props.message.data} width={400} height={400} />
  }
  return <FileMessage {...props} />
}

export default React.memo(NftMessage)
