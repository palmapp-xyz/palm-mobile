import { useMemo, useState } from 'react'
import { validateMnemonic } from 'bip39'
import Clipboard from '@react-native-clipboard/clipboard'
import { useSetRecoilState } from 'recoil'
import _ from 'lodash'

import useAuth from 'hooks/auth/useAuth'
import { generateEvmHdAccount } from 'libs/account'
import appStore from 'store/appStore'
import { AuthChallengeInfo } from 'types'

export type UseRecoverAccountReturn = {
  usePkey: boolean
  setUsePkey: (value: boolean) => void
  privateKey: string
  setPrivateKey: (value: string) => void
  seedPhrase: string[]
  updateSeedPhrase: ({ value, index }: { value: string; index: number }) => void
  mnemonicErrMsg: string
  isValidForm: boolean
  onClickConfirm: (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ) => Promise<void>
}

const useRecoverAccount = (): UseRecoverAccountReturn => {
  const { registerRequest } = useAuth()
  const [usePkey, setUsePkey] = useState(false)

  const [privateKey, setPrivateKey] = useState('')
  const [seedPhrase, setSeedPhrase] = useState<string[]>([])
  const mnemonic = seedPhrase.join(' ')

  const updateSeedPhrase = ({
    value,
    index,
  }: {
    value: string
    index: number
  }): void => {
    const splitted = value.split(' ')
    if (splitted.length > 11) {
      Clipboard.getString().then(text => {
        const clipboardList = text
          .trim()
          .split(' ')
          .map(x => x.trim())
        if (clipboardList.length > 11) {
          setSeedPhrase(clipboardList)
        }
      })
    } else {
      setSeedPhrase(oriList => {
        const newList = [...oriList]
        newList[index] = value
        return newList
      })
    }
  }

  const mnemonicErrMsg = useMemo(() => {
    if (usePkey === false && mnemonic && validateMnemonic(mnemonic) === false) {
      return 'Invalid mnemonic'
    }
    return ''
  }, [mnemonic, usePkey])

  const setLoading = useSetRecoilState(appStore.loading)

  const isValidForm = usePkey ? !!privateKey : !!mnemonic && !mnemonicErrMsg

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
        if (usePkey) {
          const res = await registerRequest({ privateKey })
          if (!res.success) {
            throw new Error(res.errMsg)
          } else {
            challenge = res.value
          }
        } else {
          await generateEvmHdAccount(mnemonic).then(
            async (account): Promise<void> => {
              const res = await registerRequest({
                privateKey: account.privateKey,
              })
              if (!res.success) {
                throw new Error(res.errMsg)
              } else {
                challenge = res.value
              }
            }
          )
        }

        setLoading(false)
        console.log('useRecoverAccount:challenge', challenge)
        callback(challenge)
      } catch (e) {
        setLoading(false)
        console.error('useRecoverAccount:authenticateRequest', e)
        callback(undefined, _.toString(e))
      }
    }, 500)
  }

  return {
    usePkey,
    setUsePkey,
    privateKey,
    setPrivateKey,
    seedPhrase,
    updateSeedPhrase,
    mnemonicErrMsg,
    isValidForm,
    onClickConfirm,
  }
}

export default useRecoverAccount
