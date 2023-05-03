import { FbChannel, FirestoreKeyEnum } from 'types'

import firestore from '@react-native-firebase/firestore'
import useReactQuery from 'hooks/complex/useReactQuery'

export type UseFsChannelsReturn = {
  fsChannelList: FbChannel[]
}

const useFsChannels = (): UseFsChannelsReturn => {
  const { data: fsChannelList = [] } = useReactQuery(
    [FirestoreKeyEnum.Channels],
    async () => {
      const list: FbChannel[] = []
      await firestore()
        .collection('channels')
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
  }
}

export default useFsChannels
