import _ from 'lodash'
import { useSetRecoilState } from 'recoil'

import useAuth from 'hooks/auth/useAuth'
import { generateEvmHdAccount } from 'libs/account'
import appStore from 'store/appStore'
import { AuthChallengeInfo } from 'types'
import { useEffect, useMemo, useState } from 'react'

export type UseConfirmSeedReturn = {
  wordList: {
    index: number
    word: string
  }[]
  hintList: {
    index: number
    word: string
  }[]
  emptyFistIndex: number
  onClickConfirm: (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ) => Promise<void>
  isValidForm: boolean
  selectedWordList: string[]
  setSelectedWordList: React.Dispatch<React.SetStateAction<string[]>>
}

const useConfirmSeed = ({
  mnemonic,
}: {
  mnemonic: string
}): UseConfirmSeedReturn => {
  const { registerRequest } = useAuth()
  const [wordList, setWordList] = useState<
    {
      index: number
      word: string
    }[]
  >([])
  const [selectedWordList, setSelectedWordList] = useState<string[]>(
    Array.from({ length: 4 })
  )
  const hintList = useMemo(() => _.shuffle(wordList), [wordList])
  const emptyFistIndex = selectedWordList.findIndex(x => !x)
  const setLoading = useSetRecoilState(appStore.loading)

  const isValidForm = _.every(
    wordList,
    (w, index) => selectedWordList[index] === w.word
  )

  const onClickConfirm = async (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      let challenge: AuthChallengeInfo | undefined
      try {
        const wallet = await generateEvmHdAccount(mnemonic)
        if (wallet) {
          const res = await registerRequest({
            privateKey: wallet.privateKey,
          })
          if (!res.success) {
            throw new Error(res.errMsg)
          } else {
            challenge = res.value
          }
        }

        setLoading(false)
        console.log('useConfirmSeed:challenge', challenge)
        callback(challenge)
      } catch (e) {
        setLoading(false)
        console.error('useConfirmSeed:authenticateRequest', e)
        callback(undefined, _.toString(e))
      }
    }, 500)
  }

  useEffect(() => {
    const _list = _.shuffle(
      mnemonic.split(' ').map((word, index) => {
        return {
          index,
          word,
        }
      })
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
