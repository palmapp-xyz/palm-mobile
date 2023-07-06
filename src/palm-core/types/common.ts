export type NominalType<T extends string> = { __type: T }

export type unixTime = string & NominalType<'unixTime'>

export type ItemListType<T = string> = {
  label: string
  value: T
}[]

export type TrueOrErrReturn<T = string> =
  | { success: true; value: T }
  | { success: false; errMsg: string }
