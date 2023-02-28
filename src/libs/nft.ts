import { FileMessageCreateParams } from '@sendbird/chat/message'
import { MediaServiceInterface } from '@sendbird/uikit-react-native'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'

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

export const getNftMessageParam = async ({
  mediaService,
  uri,
}: {
  mediaService?: MediaServiceInterface
  uri: string
}): Promise<FileMessageCreateParams> => {
  const img = await nftUriFetcher(uri)

  // Image compression
  if (
    mediaService &&
    img.fileUrl &&
    img.mimeType?.includes('svg') === false &&
    isImage(img.fileUrl, img.mimeType) &&
    shouldCompressImage(img.fileUrl, true)
  ) {
    await SBUUtils.safeRun(async () => {
      if (!img.fileUrl) {
        return
      }
      const compressed = await mediaService.compressImage({
        uri: img.fileUrl,
        compressionRate: 0.7,
      })

      if (compressed) {
        img.fileUrl = compressed.uri
        img.fileSize = compressed.size
      }
    })
  }

  return img
}
