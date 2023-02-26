import { UTIL } from 'consts'
import base64 from 'react-native-base64'
import { resolveIpfsUri } from './ipfs'

export const fixURL = (uri: string): string => {
  if (uri.startsWith('https://ipfs.moralis.io:2053/ipfs/')) {
    uri = uri.replace('https://ipfs.moralis.io:2053/ipfs/', 'ipfs://')
  } else if (uri.match(/^[a-zA-Z0-9_]+$/)) {
    // uri is just ipfs cid
    uri = `ipfs://${uri}`
  }
  return resolveIpfsUri(uri) || uri
}

export const fetchNftImage = async ({
  metadata,
  tokenUri,
}: {
  metadata?: string
  tokenUri: string
}): Promise<string> => {
  if (metadata) {
    const metadataJson = UTIL.jsonTryParse<{
      image?: string
      image_url?: string
      image_data?: string // svg+xml
    }>(metadata)
    if (metadataJson?.image) {
      return decodeURI(metadataJson.image)
    } else if (metadataJson?.image_url) {
      return decodeURI(metadataJson.image_url)
    } else if (metadataJson?.image_data) {
      return `data:image/svg+xml;base64,${base64.encode(
        metadataJson?.image_data
      )}`
    }
  }

  if (tokenUri) {
    try {
      const fetched = await fetch(fixURL(tokenUri))
      const jsonData = await fetched.json()
      if (jsonData?.image) {
        return decodeURI(jsonData.image)
      } else if (jsonData?.image_url) {
        return decodeURI(jsonData.image_url)
      }
    } catch (e) {
      console.error('fetchTokenUri failed: ', tokenUri, e)
    }
  }

  return require('../assets/no_img.png')
}
