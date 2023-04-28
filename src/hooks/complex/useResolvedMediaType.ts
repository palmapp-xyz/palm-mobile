import { resolveIpfsUri, resolveMimeType } from 'libs/ipfs'
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
    url: resolvedUrl,
    mimeType: resolvedMimType.data,
    isLoading: resolvedMimType.isLoading,
  }
}
