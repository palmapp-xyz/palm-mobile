import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import useReactQuery from 'hooks/complex/useReactQuery'
import {
  ContractAddr,
  FbChannelField,
  FirestoreKeyEnum,
  SupportedNetworkEnum,
} from 'types'
import { useMemo, useState } from 'react'
import { getFsChannel } from 'libs/firebase'

export type UseFsChannelReturn = {
  fsChannel?: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
  fsChannelField?: FbChannelField
  updateGatingToken: (
    gatingToken: ContractAddr,
    chain: SupportedNetworkEnum
  ) => Promise<void>
  isFetching: boolean
}

const useFsChannel = ({
  channelUrl,
}: {
  channelUrl: string
}): UseFsChannelReturn => {
  const [isUpdating, setIsUpdating] = useState(false)

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl || '')

  const { data: fsChannel, isFetching: isFetchingChannel } = useReactQuery(
    [FirestoreKeyEnum.Channel, channelUrl],
    async () => {
      if (channel && channelUrl) {
        return getFsChannel({ channel, channelUrl })
      }
    },
    {
      enabled: !!channel && !!channelUrl,
    }
  )

  const {
    data: fsChannelField,
    refetch: refetchField,
    isFetching: isFetchingField,
  } = useReactQuery(
    [FirestoreKeyEnum.ChannelField, fsChannel?.id],
    async () => {
      if (fsChannel) {
        return (await fsChannel?.get()).data() as FbChannelField
      }
    },
    {
      enabled: !!fsChannel,
    }
  )

  const isFetching = useMemo(
    () => isUpdating || isFetchingChannel || isFetchingField,
    [isUpdating, isFetchingChannel, isFetchingField]
  )

  const updateGatingToken = async (
    gatingToken: ContractAddr,
    chain: SupportedNetworkEnum
  ): Promise<void> => {
    setIsUpdating(true)
    await fsChannel?.update({ gatingToken, gatingTokenChain: chain })
    refetchField()
    setIsUpdating(false)
  }

  return { fsChannel, fsChannelField, updateGatingToken, isFetching }
}

export default useFsChannel
