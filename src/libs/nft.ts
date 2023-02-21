import { UTIL } from 'consts'

export const nftUriFetcher = async (
  tokenUri: string
): Promise<{ uri: string; size: number; name: string; type: string }> => {
  const fetched = await fetch(tokenUri)
  const type = fetched.headers.get('Content-Type') || ''
  const blob = await fetched.blob()
  const size = blob.size
  const name = 'file'

  if (type.includes('image')) {
    return { uri: tokenUri, type, size, name }
  }

  const blobText = await fetched.text()
  const jsonData = UTIL.jsonTryParse<{ image: string }>(blobText)
  if (jsonData && jsonData.image) {
    return { uri: jsonData.image, type, size, name }
  }
  return {
    uri: '',
    type: '',
    size: 0,
    name: '',
  }
}
