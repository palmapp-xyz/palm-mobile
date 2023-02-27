import axios from 'axios'
import { fixIpfsURL } from './ipfs'

const blobFetch = async (
  imgUri: string
): Promise<{ uri: string; size: number; name: string; type: string }> => {
  const uri = fixIpfsURL(imgUri)
  const fetched = await fetch(uri)
  let type = fetched.headers.get('Content-Type') || ''
  const blob = await fetched.blob()

  return {
    uri,
    type,
    size: blob.size,
    name: 'file',
  }
}

export const nftUriFetcher = async (
  tokenUri: string
): Promise<{ uri: string; size: number; name: string; type: string }> => {
  try {
    const fetched = await blobFetch(tokenUri)

    if (fetched.type.includes('image')) {
      return fetched
    } else if (fetched.type.includes('json')) {
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
    uri: '',
    type: '',
    size: 0,
    name: '',
  }
}
