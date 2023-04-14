import { ReactNode } from 'react'

export type NominalType<T extends string> = { __type: T }

export type unixTime = string & NominalType<'unixTime'>

export type FormDropdownOptionListType<T> = {
  isDisabled?: boolean
  label: ReactNode
  value: T
}[]

export type ItemListType<T = string> = {
  label: string
  value: T
}[]

export type TrueOrErrReturn<T = string> =
  | { success: true; value: T }
  | { success: false; errMsg: string }

export type FontType =
  | 'B.40'
  | 'B.32'
  | 'B.24'
  | 'B.20'
  | 'B.18'
  | 'B.16'
  | 'B.14'
  | 'B.12'
  | 'B.10'
  | 'SB.14'
  | 'R.32'
  | 'R.24'
  | 'R.20'
  | 'R.18'
  | 'R.16'
  | 'R.14'
  | 'R.12'
  | 'R.10'
