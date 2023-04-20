import { useToast, useAlert } from '@sendbird/uikit-react-native-foundation'
import {
  FilePickerResponse,
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'
import SBUError from '@sendbird/uikit-react-native/src/libs/SBUError'

export type UseDeviceReturn = {
  getMediaFile: () => Promise<FilePickerResponse | undefined>
}

const useDevice = (): UseDeviceReturn => {
  const { fileService } = usePlatformService()

  const { alert } = useAlert()
  const toast = useToast()
  const { STRINGS } = useLocalization()

  const getMediaFile = async (): Promise<FilePickerResponse | undefined> => {
    const files = await fileService.openMediaLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      onOpenFailure: error => {
        if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
          alert({
            title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
            message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
              STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
              STRINGS.LABELS.PERMISSION_APP_NAME
            ),
            buttons: [
              {
                text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK,
                onPress: () => SBUUtils.openSettings(),
              },
            ],
          })
        } else {
          toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error')
        }
      },
    })
    if (files) {
      return files[0]
    }
  }
  return { getMediaFile }
}

export default useDevice
