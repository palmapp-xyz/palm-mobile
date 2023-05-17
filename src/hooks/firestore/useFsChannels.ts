import { FbChannel, FirestoreKeyEnum } from 'types'

import firestore from '@react-native-firebase/firestore'
import useReactQuery from 'hooks/complex/useReactQuery'

export type UseFsChannelsReturn = {
  fsChannelList: FbChannel[]
  isLoading: boolean
}

const useFsChannels = (): UseFsChannelsReturn => {
  const limit = 5
  const { data: fsChannelList = [], isLoading } = useReactQuery(
    [FirestoreKeyEnum.Channels],
    async () => {
      const list: FbChannel[] = []
      await firestore()
        .collection('channels')
        .orderBy('updatedAt', 'desc')
        .limit(limit)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            list.push(documentSnapshot.data() as FbChannel)
          })
        })

      return list
    }
  )

  return {
    fsChannelList,
    isLoading,
  }
}

export default useFsChannels
