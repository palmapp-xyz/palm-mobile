import { ReactNode } from 'react'

type AlertBaseType = {
  icon?: ReactNode
  iconType?: 'error' | 'success'
  title?: string
  message: ReactNode
  details?: string
  confirmTitle?: string
  onClickConfirm?: () => void
  confirmDisable?: boolean
}

export type AlertType = AlertBaseType & {
  type?: 'alert'
}

export type ConfirmType = AlertBaseType & {
  type?: 'confirm'
  cancelTitle?: string
  onClickCancel?: () => void
}
