import { IPFS } from 'consts'
import * as mime from 'mime'
import { unescape } from './utils'

export function resolveIpfsUri(
  uri: string,
  options = IPFS.defaultIpfsResolverOptions
): string {
  if (uri.startsWith && uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', options.gatewayUrl)
  }
  return uri
}

export async function resolveMimeType(
  url?: string
): Promise<string | undefined> {
  if (!url) {
    return undefined
  }

  if (url?.startsWith('data:image/svg+xml;base64')) {
    return 'data:image/svg+xml;base64'
  } else if (url?.startsWith('data:image/svg+xml') || url?.startsWith('<svg')) {
    return 'data:image/svg+xml'
  }

  const mimeType = mime.getType(url)
  if (mimeType) {
    return mimeType
  }

  if (url?.endsWith('.svg')) {
    return 'image/svg+xml'
  } else if (url?.endsWith('.jpg') || url?.endsWith('.jpeg')) {
    return 'image/jpeg'
  } else if (url?.endsWith('.png')) {
    return 'image/png'
  }

  const res = await fetch(url, {
    method: 'HEAD',
  })
  if (res.ok && res.headers.has('content-type')) {
    return res.headers.get('content-type') ?? undefined
  }

  // we failed to resolve the mime type, return null
  return undefined
}

export const fixTokenUri = (uri: string): string => {
  let unescaped = unescape(uri)
  try {
    unescaped = decodeURI(uri)
  } catch (e) {
    // console.error(uri, e)
  }

  if (unescaped.startsWith('https://ipfs.moralis.io:2053/ipfs/')) {
    unescaped = unescaped.replace(
      'https://ipfs.moralis.io:2053/ipfs/',
      'ipfs://'
    )
  } else if (unescaped.startsWith('https://ipfs.io/ipfs/')) {
    unescaped = unescaped.replace('https://ipfs.io/ipfs/', 'ipfs://')
  } else if (unescaped.match(/^[a-zA-Z0-9_]+$/)) {
    // uri is just ipfs cid
    unescaped = `ipfs://${unescaped}`
  } else if (
    unescaped.match(
      /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    )
  ) {
    // url but missing https://
    unescaped = `https://${unescaped}`
  }

  return resolveIpfsUri(unescaped) || unescaped
}
