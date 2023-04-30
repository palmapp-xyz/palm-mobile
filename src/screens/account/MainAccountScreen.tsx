import images from 'assets/images'
import { Container, FormButton, FormImage, FormText, Row } from 'components'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'

const MainAccountScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const snapPoints = useMemo(() => ['25%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <>
      <Container style={styles.container}>
        <View style={styles.top}>
          <FormImage source={images.palm_logo} size={88} />
          <FormText fontType="B.24" style={{ textAlign: 'center' }}>
            {'Hi, there!\nWelcome to Palm'}
          </FormText>
        </View>
        <View style={styles.bottom}>
          <FormButton
            onPress={(): void => {
              navigation.navigate(Routes.RecoverAccount, { isSignUp: false })
            }}>
            Restore My Account
          </FormButton>
          <FormButton
            figure="outline"
            onPress={(): void => {
              setShowBottomSheet(true)
              bottomSheetRef?.current?.snapToIndex(1)
            }}>
            Sign up with a Wallet
          </FormButton>
        </View>
      </Container>
      {showBottomSheet && (
        <View style={styles.bottomSheetOverlay}>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enableOverDrag={false}
            enablePanDownToClose
            onClose={(): void => {
              setShowBottomSheet(false)
            }}>
            <Row style={styles.bottomSheet}>
              <TouchableOpacity
                style={styles.bottomItem}
                onPress={(): void => {
                  navigation.navigate(Routes.NewAccount)
                }}>
                <FormImage source={images.plus} size={32} />
                <FormText fontType="R.12" style={{ textAlign: 'center' }}>
                  {'Create a\nnew wallet'}
                </FormText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomItem}
                onPress={(): void => {
                  navigation.navigate(Routes.RecoverAccount, {
                    isSignUp: true,
                  })
                }}>
                <FormImage source={images.import} size={32} />
                <FormText fontType="R.12" style={{ textAlign: 'center' }}>
                  {'Import\na wallet'}
                </FormText>
              </TouchableOpacity>
            </Row>
          </BottomSheet>
        </View>
      )}
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
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 120,
    columnGap: 8,
  },
})
