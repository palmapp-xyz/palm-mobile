import { useMemo, useState } from 'react'
import { validateMnemonic } from 'bip39'
import Clipboard from '@react-native-clipboard/clipboard'
import _ from 'lodash'
import { Alert } from 'react-native'

import useAuth from 'hooks/auth/useAuth'
import { savePkey } from 'libs/account'

export type UseRecoverAccountReturn = {
  usePkey: boolean
  setUsePkey: (value: boolean) => void
  privateKey: string
  setPrivateKey: (value: string) => void
  seedPhrase: string[]
  updateSeedPhrase: ({ value, index }: { value: string; index: number }) => void
  mnemonicErrMsg: string
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useRecoverAccount = (): UseRecoverAccountReturn => {
  const { registerMnemonic } = useAuth()
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

  const isValidForm = usePkey ? !!privateKey : !!mnemonic && !mnemonicErrMsg

  const onClickConfirm = async (): Promise<void> => {
    try {
      if (usePkey) {
        await savePkey(privateKey)
      } else {
        await registerMnemonic(mnemonic)
      }
    } catch (e) {
      console.error('useRecoverAccount:error', e)
      Alert.alert(_.toString(e))
    }
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
