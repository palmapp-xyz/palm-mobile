import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement, useMemo } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { FormButton } from 'components'
import Header from './Header'
import NftCollectionList from './NftCollectionList'
import NftList from './NftList'

const MyNftList = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { user } = useAuth()

  const {
    runningNextStep,
    selectedCollection,
    stepAfterSelectNft,
    selectedNftList,
  } = useGcInputReturn

  const userAddress = user?.address
  const snapPoints = useMemo(() => ['100%'], [])

  return stepAfterSelectNft ? (
    <BottomSheet snapPoints={snapPoints} enableOverDrag={false}>
      <View style={styles.container}>
        <Header useGcInputReturn={useGcInputReturn} />
        {selectedCollection ? (
          <View style={{ flex: 1 }}>
            <NftList
              userAddress={userAddress}
              useGcInputReturn={useGcInputReturn}
              selectedCollection={selectedCollection}
            />
            <View style={styles.footer}>
              {runningNextStep ? (
                <View style={styles.nextStepIcon}>
                  <ActivityIndicator size="large" color={COLOR.primary._400} />
                </View>
              ) : (
                <FormButton
                  disabled={selectedNftList.length < 1}
                  onPress={useGcInputReturn.onClickNextStep}
                >
                  Select
                </FormButton>
              )}
            </View>
          </View>
        ) : (
          <NftCollectionList
            userAddress={userAddress}
            useGcInputReturn={useGcInputReturn}
          />
        )}
      </View>
    </BottomSheet>
  ) : (
    <></>
  )
}

export default MyNftList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
    marginTop: 10,
  },
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
  },
  selectItemIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.primary._400,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepIcon: {
    width: 36,
    height: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})