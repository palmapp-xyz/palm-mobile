import { UTIL } from 'consts'

export const fixURL = (uri: string): string => {
  if (uri.startsWith('https://ipfs.moralis.io:2053/ipfs/')) {
    uri = uri.replace(
      'https://ipfs.moralis.io:2053/ipfs/',
      'https://gateway.ipfscdn.io/ipfs/'
    )
  } else if (uri.startsWith('ipfs://')) {
    uri = uri.replace('ipfs://', 'https://gateway.ipfscdn.io/ipfs/')
  } else if (uri.match(/^[a-zA-Z0-9_]+$/)) {
    // uri is just ipfs cid
    uri = `https://gateway.ipfscdn.io/ipfs/${uri}`
  }
  return uri
}

export const fetchNftImage = async ({
  metadata,
  tokenUri,
}: {
  metadata?: string
  tokenUri: string
}): Promise<string> => {
  if (metadata) {
    const metadataJson = UTIL.jsonTryParse<{ image: string }>(metadata)
    if (metadataJson) {
      return metadataJson.image
    }
  }

  try {
    const fetched = await fetch(fixURL(tokenUri))
    let blob = await fetched.blob()
    if (blob.type.includes('image')) {
      return tokenUri
    }

    const blobText = await blob.text()
    const jsonData = UTIL.jsonTryParse<{ image: string }>(blobText)
    if (jsonData && jsonData.image) {
      return jsonData.image
    }
  } catch {}
  return require('../assets/no_img.png')
}
