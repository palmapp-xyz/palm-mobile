import { UTIL } from 'palm-core/libs'
import { Token } from 'palm-core/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useFormattedValue = (
  onChangeValue?: (value: Token) => void
): {
  formattedValue: Token
  value: Token
  setValue: Dispatch<SetStateAction<Token>>
} => {
  const [formattedValue, setFormattedValue] = useState<Token>('' as Token)
  const [value, setValue] = useState<Token>('' as Token)

  useEffect(() => {
    const compareValue = UTIL.removeCommasToNumber(value.toString())
    compareValue !== value.toString() && setValue(compareValue as Token)
    setFormattedValue(UTIL.addCommasToNumber(value.toString()) as Token)

    onChangeValue?.(compareValue as Token)
  }, [value])

  console.log(value, formattedValue)

  return {
    formattedValue,
    value,
    setValue,
  }
}

export default useFormattedValue
