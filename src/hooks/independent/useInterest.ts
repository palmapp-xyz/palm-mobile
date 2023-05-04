import AsyncStorage from '@react-native-async-storage/async-storage'
import { UTIL } from 'consts'
import { useQuery } from 'react-query'
import { LocalStorageKey } from 'types'

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
    isLoading,
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

  return { interestList, addInterestList, deleteInterest, isLoading }
}

export default useInterest
