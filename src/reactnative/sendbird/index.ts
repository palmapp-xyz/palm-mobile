import { Platform, StatusBar } from 'react-native'
import * as DocumentPicker from 'react-native-document-picker'
import * as FileAccess from 'react-native-file-access'
import * as ImagePicker from 'react-native-image-picker'
import * as Permissions from 'react-native-permissions'
import Video from 'react-native-video'

import * as ImageResizer from '@bam.tech/react-native-image-resizer'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import Clipboard from '@react-native-clipboard/clipboard'
import RNFBMessaging from '@react-native-firebase/messaging'
import {
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  createNativeNotificationService,
} from '@sendbird/uikit-react-native'
import { Logger } from '@sendbird/uikit-utils'
import * as CreateThumbnail from '@skqksh/react-native-create-thumbnail'

export const ClipboardService = createNativeClipboardService(Clipboard)
export const NotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
})
export const FileService = createNativeFileService({
  imagePickerModule: ImagePicker,
  documentPickerModule: DocumentPicker,
  permissionModule: Permissions,
  fsModule: FileAccess,
  mediaLibraryModule: CameraRoll,
})
export const MediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
  imageResizerModule: ImageResizer,
})

export const GetTranslucent = (state = true): boolean | undefined => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state)
  return Platform.select({ ios: state, android: state })
}

if (__DEV__) {
  const PromiseLogger = Logger.create('debug')
  PromiseLogger.setTitle('[UIKit/promiseUnhandled]')
  const opts =
    require('react-native/Libraries/promiseRejectionTrackingOptions').default

  // const originHandler = opts.onUnhandled;
  opts.onUnhandled = (_: number, rejection = { code: undefined }): void => {
    PromiseLogger.log(rejection, rejection.code ?? '')
    // originHandler(_, rejection);
  }

  require('promise/setimmediate/rejection-tracking').enable(opts)
}
