import {
  ToastColorType,
  ToastIconType,
} from 'palm-react-native-ui-kit/screens/app/ToastView'
import { useToast as useRNToast } from 'react-native-toast-notifications'

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
  const toast = useRNToast()

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
