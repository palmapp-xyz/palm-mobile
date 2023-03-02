import { FileMessageCreateParams } from '@sendbird/chat/message'

import axios from 'axios'
import { fixIpfsURL } from './ipfs'

const blobFetch = async (imgUri: string): Promise<FileMessageCreateParams> => {
  const uri = fixIpfsURL(imgUri)
  const fetched = await fetch(uri)
  let type = fetched.headers.get('Content-Type') || ''
  const blob = await fetched.blob()

  return {
    fileUrl: uri,
    mimeType: type,
    fileSize: blob.size,
    fileName: 'file',
  }
}

export const nftUriFetcher = async (
  tokenUri: string
): Promise<FileMessageCreateParams> => {
  try {
    const fetched = await blobFetch(tokenUri)

    if (fetched.mimeType?.includes('image')) {
      return fetched
    } else if (fetched.mimeType?.includes('json')) {
      const axiosData = await axios.get(fixIpfsURL(tokenUri))

      const jsonData = axiosData.data
      if (jsonData && jsonData.image) {
        return blobFetch(jsonData.image)
      }
    }
  } catch (error) {
    console.log('nftUriFetcher error : ', error)
  }

  return {
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    mimeType: '',
  }
}
