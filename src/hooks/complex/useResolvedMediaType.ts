import { resolveIpfsUri, resolveMimeType } from 'libs/ipfs'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { MediaType } from 'types'

/**
 * @param uri - the uri to resolve (can be a url or a ipfs://\<cid\>)
 * @returns the fully resolved url + mime type of the media
 *
 * @example
 * Usage with fully formed url:
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("https://example.com/video.mp4");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 *
 * Usage with ipfs cid:
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvsd");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 */
export function useResolvedMediaType(uri?: string): MediaType {
  const resolvedUrl = useMemo(() => resolveIpfsUri(uri), [uri])
  const resolvedMimType = useQuery(
    ['mime-type', resolvedUrl],
    () => resolveMimeType(resolvedUrl),
    {
      enabled: !!resolvedUrl,
    }
  )

  return {
    url: resolvedUrl,
    mimeType: resolvedMimType.data,
  }
}
