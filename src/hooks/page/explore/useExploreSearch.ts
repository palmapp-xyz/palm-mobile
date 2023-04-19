import { useState } from 'react'
import { Alert } from 'react-native'

import useApi from 'hooks/complex/useApi'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import { ApiEnum } from 'types'

export type UseExploreSearchReturn = {
  inputSearch: string
  setInputSearch: (value: string) => void
  isSearching: boolean
  onClickConfirm: () => Promise<void>
}

const useExploreSearch = (): UseExploreSearchReturn => {
  const [inputSearch, setInputSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { postApi } = useApi()

  const onClickConfirm = async (): Promise<void> => {
    setIsSearching(true)
    try {
      const apiPath = apiV1Fabricator[ApiEnum.SEARCH].post()

      const fetchResult = await postApi<ApiEnum.SEARCH>({
        path: apiPath,
        params: {
          query: inputSearch,
          page: 1,
          pageSize: 10,
          searchFields: ['name', 'handle'],
        },
      })

      if (fetchResult.success) {
        Alert.alert(
          JSON.stringify(
            fetchResult.data?.response?.hits?.hits?.map(x => x?._source.handle),
            null,
            2
          )
        )
      }
    } finally {
      setIsSearching(false)
    }
  }
  return {
    inputSearch,
    setInputSearch,
    isSearching,
    onClickConfirm,
  }
}

export default useExploreSearch
