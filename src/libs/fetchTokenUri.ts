import axios from 'axios'
import { UTIL } from 'consts'
import { fixIpfsURL } from './ipfs'
import { unescape } from './utils'
import { Maybe } from '@toruslabs/openlogin'

export type FetchNftImageReturn = {
  image: string
  metadata: Maybe<string>
}

export const fetchNftImage = async ({
  metadata,
  tokenUri,
}: {
  metadata?: Maybe<string>
  tokenUri: string
}): Promise<FetchNftImageReturn> => {
  if (metadata) {
    const metadataJson = UTIL.jsonTryParse<{
      image?: string
      image_url?: string
      image_data?: string // svg+xml
    }>(metadata)
    const ret =
      metadataJson?.image || metadataJson?.image_url || metadataJson?.image_data
    if (ret) {
      return { image: unescape(fixIpfsURL(ret)), metadata }
    }
  }

  if (tokenUri) {
    try {
      const fixedUrl = fixIpfsURL(tokenUri)
      const fetched = await fetch(fixedUrl)
      const blob = await fetched.blob()
      if (blob.type.startsWith('image')) {
        return { image: fixedUrl, metadata: await blob.text() }
      }

      const axiosData = await axios.get(fixedUrl)
      const jsonData = axiosData.data
      const ret = jsonData?.image || jsonData?.image_url || jsonData?.image_data
      if (ret) {
        return {
          image: unescape(fixIpfsURL(ret)),
          metadata: JSON.stringify(jsonData),
        }
      }
    } catch (e) {
      console.error('fetchTokenUri failed: ', metadata, tokenUri, e)
    }
  }

  return { image: require('../assets/no_img.png'), metadata: null }
}
