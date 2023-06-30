import { resolveIpfsUri, resolveMimeType } from 'core/libs/ipfs'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

export type UseResolvedMediaTypeReturn = {
  url?: string
  mimeType?: string
  isLoading: boolean
}

export function useResolvedMediaType(uri: string): UseResolvedMediaTypeReturn {
  const resolvedUrl = useMemo(() => resolveIpfsUri(uri), [uri])
  const resolvedMimType = useQuery(
    ['mime-type', resolvedUrl],
    () => resolveMimeType(resolvedUrl),
    {
      enabled: !!resolvedUrl,
    }
  )

  return {
    url: String(resolvedUrl).replace('data:image/svg+xml,', ''),
    mimeType: resolvedMimType.data,
    isLoading: resolvedMimType.status === 'loading',
  }
}
