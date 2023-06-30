import images from 'assets/images'
import {
  Container,
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  Row,
} from 'components'
import { COLOR } from 'core/consts'
import { Routes } from 'core/libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'

const MainAccountScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { t } = useTranslation()

  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const snapPoints = useMemo(() => ['25%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <>
      <Container style={styles.container}>
        <View style={styles.top}>
          <FormImage source={images.palm_logo} size={88} />
          <FormText font={'B'} size={24} style={{ textAlign: 'center' }}>
            {t('Auth.MainTitle')}
          </FormText>
        </View>
        <View style={styles.bottom}>
          <FormButton
            onPress={(): void => {
              navigation.navigate(Routes.RecoverAccount, {
                type: 'restoreWallet',
              })
            }}
          >
            {t('Auth.RestoreMyAccount')}
          </FormButton>
          <FormButton
            figure="outline"
            onPress={(): void => {
              setShowBottomSheet(true)
              bottomSheetRef?.current?.snapToIndex(1)
            }}
          >
            {t('Auth.SignUpWithWallet')}
          </FormButton>
        </View>
      </Container>
      <FormBottomSheet
        bottomSheetRef={bottomSheetRef}
        showBottomSheet={showBottomSheet}
        snapPoints={snapPoints}
        onClose={(): void => setShowBottomSheet(false)}
      >
        <Row style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={(): void => {
              navigation.navigate(Routes.NewAccount)
            }}
          >
            <FormImage source={images.plus} size={32} />
            <FormText style={{ textAlign: 'center' }}>
              {t('Auth.CreateNewWallet')}
            </FormText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={(): void => {
              navigation.navigate(Routes.RecoverAccount, {
                type: 'importWallet',
              })
            }}
          >
            <FormImage source={images.import} size={32} />
            <FormText style={{ textAlign: 'center' }}>
              {t('Auth.ImportWallet')}
            </FormText>
          </TouchableOpacity>
        </Row>
      </FormBottomSheet>
    </>
  )
}

export default MainAccountScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 24,
  },
  bottom: {
    flex: 1,
    paddingHorizontal: 60,
    rowGap: 8,
  },
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
