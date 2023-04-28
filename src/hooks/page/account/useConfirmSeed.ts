import _ from 'lodash'

import useAuth from 'hooks/auth/useAuth'
import { useEffect, useMemo, useState } from 'react'

type WordListType = {
  index: number
  word: string
}[]

export type UseConfirmSeedReturn = {
  wordList: WordListType
  hintList: WordListType
  emptyFistIndex: number
  onClickConfirm: () => Promise<void>
  isValidForm: boolean
  selectedWordList: string[]
  setSelectedWordList: React.Dispatch<React.SetStateAction<string[]>>
}

const useConfirmSeed = ({
  mnemonic,
}: {
  mnemonic: string
}): UseConfirmSeedReturn => {
  const { registerMnemonic } = useAuth()
  const [wordList, setWordList] = useState<WordListType>([])
  const [selectedWordList, setSelectedWordList] = useState<string[]>(
    Array.from({ length: 4 })
  )
  const hintList = useMemo(() => _.shuffle(wordList), [wordList])
  const emptyFistIndex = selectedWordList.findIndex(x => !x)

  const isValidForm = _.every(
    wordList,
    (w, index) => selectedWordList[index] === w.word
  )

  const onClickConfirm = async (): Promise<void> => {
    try {
      await registerMnemonic(mnemonic)
    } catch (e) {
      console.error('useConfirmSeed:error', e)
    }
  }

  useEffect(() => {
    const _list = _.shuffle(
      mnemonic.split(' ').map((word, index) => ({ index, word }))
    ).slice(0, 4)
    setWordList(_list)
  }, [])

  return {
    wordList,
    hintList,
    emptyFistIndex,
    onClickConfirm,
    isValidForm,
    selectedWordList,
    setSelectedWordList,
  }
}

export default useConfirmSeed
