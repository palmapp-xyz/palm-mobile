import useSetting from 'hooks/independent/useSetting'
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryFunction,
} from 'react-query'

const useReactQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: unknown[],
  queryFn: QueryFunction<TQueryFnData, unknown[]>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, unknown[]>
): UseQueryResult<TData, TError> => {
  const { setting } = useSetting()

  return useQuery(queryKey.concat(setting.network), queryFn, options)
}

export default useReactQuery
