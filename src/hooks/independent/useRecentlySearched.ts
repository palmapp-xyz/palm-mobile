import { UTIL } from 'core/libs'
import { LocalStorageKey, RecentlySearchItemStorageType } from 'core/types'
import { format } from 'date-fns'
import { useQuery } from 'react-query'

import AsyncStorage from '@react-native-async-storage/async-storage'

export type UseRecentlySearchedReturn = {
  searchedList: RecentlySearchItemStorageType[]
  addSearch: (value: string) => Promise<void>
  deleteSearch: (value: string) => Promise<void>
}

const useRecentlySearched = (): UseRecentlySearchedReturn => {
  const { data: searchedList = [], refetch: refetchSearch } = useQuery(
    [LocalStorageKey.RECENTLY_SEARCHED],
    async () => {
      const item = await AsyncStorage.getItem(LocalStorageKey.RECENTLY_SEARCHED)
      return UTIL.jsonTryParse<RecentlySearchItemStorageType[]>(
        item || '[]'
      )?.sort((a, b) => (a.id > b.id ? -1 : 1))
    }
  )

  const addSearch = async (search: string): Promise<void> => {
    const now = new Date()
    await AsyncStorage.setItem(
      LocalStorageKey.RECENTLY_SEARCHED,
      JSON.stringify(
        searchedList.concat({
          id: now.getTime().toString(),
          search,
          date: format(now, 'yy.MM.dd'),
        })
      )
    )

    refetchSearch()
  }

  const deleteSearch = async (id: string): Promise<void> => {
    await AsyncStorage.setItem(
      LocalStorageKey.RECENTLY_SEARCHED,
      JSON.stringify(searchedList.filter(x => x.id !== id))
    )
    refetchSearch()
  }

  return { searchedList, addSearch, deleteSearch }
}

export default useRecentlySearched
