import axios from 'axios'
import { UTIL } from 'consts'
import { fixIpfsURL } from './ipfs'
import { unescape } from './utils'
import { Maybe } from '@toruslabs/openlogin'
import { ContractAddr } from 'types'
import { isENS } from './ens'

export type FetchNftImageReturn = {
  image: string
  metadata: Maybe<string>
}

export const fetchNftImage = async ({
  nftContract,
  tokenId,
  metadata,
  tokenUri,
}: {
  nftContract: ContractAddr
  tokenId: string
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

  if (tokenUri?.startsWith('data:application/json;base64')) {
    const decoded = JSON.parse(
      Buffer.from(
        tokenUri.replace(/^data:\w+\/\w+;base64,/, ''),
        'base64'
      ).toString()
    )

    const ret = decoded?.image || decoded?.image_url || decoded?.image_data
    if (ret) {
      return {
        image: unescape(fixIpfsURL(ret)),
        metadata: JSON.stringify(decoded),
      }
    }
  }

  if (tokenUri) {
    try {
      const fixedUrl = fixIpfsURL(tokenUri)
      const fetched = await fetch(fixedUrl)
      const blob = await fetched.blob()
      if (blob.type.startsWith('image')) {
        return {
          image: fixedUrl,
          metadata: blob.text ? await blob.text() : undefined,
        }
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

  if (isENS(nftContract)) {
    const res = await axios.get(
      `https://metadata.ens.domains/mainnet/${nftContract}/${tokenId}`
    )
    if (res.status === 200) {
      const jsonData = res.data
      const ret = jsonData?.image || jsonData?.image_url || jsonData?.image_data
      return { image: ret, metadata: JSON.stringify(jsonData) }
    }
  }

  return { image: require('../assets/no_img.png'), metadata: null }
}
