import useToast from 'palm-react-native/app/useToast'

import {
  FilePickerResponse,
  useLocalization,
  usePlatformService,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'
import SBUError from '@sendbird/uikit-react-native/src/libs/SBUError'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'
import { isImage, shouldCompressImage } from '@sendbird/uikit-utils'

export type UseDeviceReturn = {
  getMediaFile: () => Promise<FilePickerResponse | undefined>
}

const useDevice = (): UseDeviceReturn => {
  const { fileService, mediaService } = usePlatformService()
  const { imageCompressionConfig, features } = useSendbirdChat()

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
          toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, {
            color: 'green',
            icon: 'check',
          })
        }
      },
    })
    if (files && files[0]) {
      const file = files[0]

      // Image compression
      if (
        isImage(file.uri, file.type) &&
        shouldCompressImage(file.type, features.imageCompressionEnabled)
      ) {
        await SBUUtils.safeRun(async () => {
          const compressed = await mediaService.compressImage({
            uri: file.uri,
            maxWidth: imageCompressionConfig.width,
            maxHeight: imageCompressionConfig.height,
            compressionRate: imageCompressionConfig.compressionRate,
          })

          if (compressed) {
            file.uri = compressed.uri
            file.size = compressed.size
          }
        })
      }

      return files[0]
    }
  }
  return { getMediaFile }
}

export default useDevice
