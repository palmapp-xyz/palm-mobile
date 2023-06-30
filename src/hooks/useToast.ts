import {
  useToast as useToastFromRnToastNotifications,
} from 'react-native-toast-notifications'
import { ToastColorType, ToastIconType } from 'screens/ToastView'

const useToast = (): {
  show: (
    message: string | JSX.Element,
    data: { color: ToastColorType; icon?: ToastIconType }
  ) => string
  update: (
    id: string,
    message: string | JSX.Element,
    data: { color: ToastColorType; icon?: ToastIconType }
  ) => void
  hide: (id: string) => void
  hideAll: () => void
} => {
  const toast = useToastFromRnToastNotifications()

  const show = (
    message: string | JSX.Element,
    data: { color: ToastColorType; icon?: ToastIconType }
  ): string => {
    return toast.show(message, { data })
  }

  const update = (
    id: string,
    message: string | JSX.Element,
    data: { color: ToastColorType; icon?: ToastIconType }
  ): void => {
    toast.update(id, message, { data })
  }

  const hide = (id: string): void => {
    toast.hide(id)
  }

  const hideAll = (): void => {
    toast.hideAll()
  }

  return { show, update, hide, hideAll }
}

export default useToast
