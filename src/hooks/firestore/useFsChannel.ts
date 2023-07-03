import { DocumentReference, DocumentSnapshot } from 'palm-core/firebase'
import { onChannel } from 'palm-core/firebase/channel'
import { FbChannel } from 'palm-core/types'
import { useEffect, useState } from 'react'

export type UseFsChannelReturn = {
  fsChannel: DocumentReference<FbChannel> | undefined
  fsChannelField: FbChannel | undefined
}

const useFsChannel = ({
  channelUrl,
}: {
  channelUrl: string
}): UseFsChannelReturn => {
  const [fsChannel, setFsChannel] = useState<DocumentReference<FbChannel>>()
  const [fsChannelField, setFsChannelField] = useState<FbChannel>()

  useEffect(() => {
    const { ref, unsubscribe } = onChannel(channelUrl, {
      onNext: function (snapshot: DocumentSnapshot<FbChannel>): void {
        setFsChannelField(snapshot.data())
      },
    })
    setFsChannel(ref)
    return unsubscribe
  }, [channelUrl])

  return { fsChannel, fsChannelField }
}

export default useFsChannel
