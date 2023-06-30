import { UTIL } from 'core/libs'
import { LocalStorageKey } from 'core/types'
import { useQuery } from 'react-query'

import AsyncStorage from '@react-native-async-storage/async-storage'

export type UseInterestReturn = {
  interestList: string[]
  addInterestList: (value: string[]) => Promise<void>
  deleteInterest: (value: string) => Promise<void>
  isLoading: boolean
}

const useInterest = (): UseInterestReturn => {
  const {
    data: interestList = [],
    refetch: refetchInterest,
    status,
  } = useQuery([LocalStorageKey.INTEREST], async () => {
    const item = await AsyncStorage.getItem(LocalStorageKey.INTEREST)
    return UTIL.jsonTryParse<string[]>(item || '[]')
  })

  const addInterestList = async (value: string[]): Promise<void> => {
    await AsyncStorage.setItem(
      LocalStorageKey.INTEREST,
      JSON.stringify(interestList.concat(value))
    )

    refetchInterest()
  }

  const deleteInterest = async (value: string): Promise<void> => {
    await AsyncStorage.setItem(
      LocalStorageKey.INTEREST,
      JSON.stringify(interestList.filter(x => x !== value))
    )
    refetchInterest()
  }

  return {
    interestList,
    addInterestList,
    deleteInterest,
    isLoading: status === 'loading',
  }
}

export default useInterest
