import { UTIL } from 'consts'
import { format } from 'date-fns'
import useApi from 'hooks/complex/useApi'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import { useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useQuery } from 'react-query'
import {
  ApiEnum,
  FbChannel,
  FbProfile,
  LocalStorageKey,
  RecentlySearchItemStorageType,
} from 'types'

import AsyncStorage from '@react-native-async-storage/async-storage'

export type UseExploreSearchReturn = {
  scrollOffsetY: Animated.Value
  inputSearch: string
  setInputSearch: (value: string) => void
  isSearching: boolean
  onClickConfirm: (searchValue?: string) => Promise<void>
  searchChannelResult: FbChannel[]
  searchProfileResult: FbProfile[]
  recentlySearchedList: RecentlySearchItemStorageType[]
  addRecentlySearch: (value: string) => Promise<void>
  deleteRecentlySearch: (value: string) => Promise<void>
  selectedChannel?: FbChannel
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<FbChannel | undefined>
  >
}

const useExploreSearch = (): UseExploreSearchReturn => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current
  const [inputSearch, setInputSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchChannelResult, setSearchChannelResult] = useState<FbChannel[]>(
    []
  )
  const [searchProfileResult, setSearchProfileResult] = useState<FbProfile[]>(
    []
  )
  const [selectedChannel, setSelectedChannel] = useState<FbChannel>()

  const { postApi } = useApi()

  const { data: recentlySearchedList = [], refetch: refetchRecentlySearch } =
    useQuery([LocalStorageKey.RECENTLY_SEARCHED], async () => {
      const item = await AsyncStorage.getItem(LocalStorageKey.RECENTLY_SEARCHED)
      return UTIL.jsonTryParse<RecentlySearchItemStorageType[]>(
        item || '[]'
      )?.sort((a, b) => (a.id > b.id ? -1 : 1))
    })

  const addRecentlySearch = async (search: string): Promise<void> => {
    const now = new Date()
    await AsyncStorage.setItem(
      LocalStorageKey.RECENTLY_SEARCHED,
      JSON.stringify(
        recentlySearchedList.concat({
          id: now.getTime().toString(),
          search,
          date: format(now, 'yy.MM.dd'),
        })
      )
    )

    refetchRecentlySearch()
  }

  const deleteRecentlySearch = async (id: string): Promise<void> => {
    await AsyncStorage.setItem(
      LocalStorageKey.RECENTLY_SEARCHED,
      JSON.stringify(recentlySearchedList.filter(x => x.id !== id))
    )
    refetchRecentlySearch()
  }

  const onClickConfirm = async (searchValue?: string): Promise<void> => {
    const query = searchValue || inputSearch
    if (!query) {
      return
    }

    setIsSearching(true)
    scrollOffsetY.setValue(0)
    await addRecentlySearch(query)
    refetchRecentlySearch()
    setSearchChannelResult([])
    setSearchProfileResult([])
    try {
      const apiPath = apiV1Fabricator[ApiEnum.SEARCH].post()

      const fetchResult = await postApi<ApiEnum.SEARCH>({
        path: apiPath,
        params: {
          query,
          page: 1,
          pageSize: 10,
          searchFields: ['handle', 'tags', 'name', 'desc'],
        },
      })

      if (fetchResult.success) {
        const anyList = fetchResult.data?.result?.map(x => x?._source)
        anyList.forEach(x => {
          if ('channelType' in x) {
            setSearchChannelResult(oriList => [...oriList, x])
          } else {
            setSearchProfileResult(oriList => [...oriList, x])
          }
        })
      }
    } finally {
      setIsSearching(false)
    }
  }

  return {
    scrollOffsetY,
    inputSearch,
    setInputSearch,
    isSearching,
    onClickConfirm,
    searchChannelResult,
    searchProfileResult,
    recentlySearchedList,
    addRecentlySearch,
    deleteRecentlySearch,
    selectedChannel,
    setSelectedChannel,
  }
}

export default useExploreSearch
