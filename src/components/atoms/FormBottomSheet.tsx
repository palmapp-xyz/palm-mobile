import { COLOR } from 'consts'
import React, { ReactElement, ReactNode } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'

const FormBottomSheet = ({
  bottomSheetRef,
  children,
  showBottomSheet,
  snapPoints,
  onClose,
  backgroundStyle,
}: {
  bottomSheetRef: React.RefObject<BottomSheetMethods>
  children: ReactNode
  showBottomSheet: boolean
  snapPoints: string[]
  onClose: () => void
  backgroundStyle?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <>
      {showBottomSheet && (
        <View style={styles.bottomSheetOverlay}>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enableOverDrag={false}
            enablePanDownToClose
            onClose={onClose}
            backgroundStyle={backgroundStyle}
            containerStyle={{ marginBottom: Platform.select({ android: 30 }) }}
          >
            {children}
          </BottomSheet>
        </View>
      )}
    </>
  )
}

export default FormBottomSheet

const styles = StyleSheet.create({
  bottomSheetOverlay: {
    position: 'absolute',
    backgroundColor: '#00000018',
    width: '100%',
    height: '100%',
    bottom: 0,
    zIndex: 1,
  },
  bottomSheet: {
    columnGap: 14,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomItem: {
    borderRadius: 14,
    backgroundColor: COLOR.black._90005,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 120,
    columnGap: 8,
  },
})
