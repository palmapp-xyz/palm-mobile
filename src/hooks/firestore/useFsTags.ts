import firestore from '@react-native-firebase/firestore'

import useReactQuery from 'hooks/complex/useReactQuery'
import { FbTags, FirestoreKeyEnum } from 'types'

export type UseFsTagsReturn = {
  fsTags?: FbTags
  isFetching: boolean
}

const useFsTags = (): UseFsTagsReturn => {
  const { data: fsTags, isFetching } = useReactQuery(
    [FirestoreKeyEnum.Tag],
    async () => {
      const _fsTags = await firestore().collection('tags').get()
      return _fsTags.docs[0].data() as FbTags
    }
  )

  return { fsTags, isFetching }
}

export default useFsTags
