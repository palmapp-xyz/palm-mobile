import { validateMnemonic } from 'bip39'
import _ from 'lodash'
import { recordError } from 'palm-core/libs/logger'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import useAuth from 'palm-react/hooks/auth/useAuth'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Clipboard from '@react-native-clipboard/clipboard'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

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
  const { alert } = useAlert()
  const { t } = useTranslation()

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
        await PkeyManager.savePkey(privateKey)
      } else {
        await registerMnemonic(mnemonic)
      }
    } catch (e) {
      recordError(e, 'useRecoverAccount:error')
      alert({ title: t('Auth.RecoverErrorAlertTitle'), message: _.toString(e) })
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
