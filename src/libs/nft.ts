import axios from 'axios'

const imageFetcher = async (
  imgUri: string
): Promise<{ uri: string; size: number; name: string; type: string }> => {
  const fetched = await fetch(imgUri)
  let type = fetched.headers.get('Content-Type') || ''
  const blob = await fetched.blob()

  return {
    uri: imgUri,
    type,
    size: blob.size,
    name: 'file',
  }
}

export const nftUriFetcher = async (
  tokenUri: string
): Promise<{ uri: string; size: number; name: string; type: string }> => {
  try {
    const fetched = await imageFetcher(tokenUri)

    if (fetched.type.includes('image')) {
      return fetched
    } else if (fetched.type.includes('json')) {
      const axiosData = await axios.get(tokenUri)

      const jsonData = axiosData.data
      if (jsonData && jsonData.image) {
        return imageFetcher(jsonData.image)
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
