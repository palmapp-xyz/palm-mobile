import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Moralis, SupportedNetworkEnum } from 'types'

import BottomSheet from '@gorhom/bottom-sheet'
import Header from './Header'
import NftCollectionList from './NftCollectionList'
import NftList from './NftList'

const MyNftList = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { user } = useAuth()
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollection, setSelectedCollection] =
    useState<Moralis.NftCollection>()

  const onChangeNetwork = (value: SupportedNetworkEnum): void => {
    setSelectedNetwork(value)
    setSelectedCollection(undefined)
  }

  const userAddress = user?.address

  const snapPoints = useMemo(() => ['100%'], [])

  return useGcInputReturn.stepAfterSelectNft ? (
    <View style={styles.container}>
      <BottomSheet snapPoints={snapPoints} enableOverDrag={false}>
        <Header
          useGcInputReturn={useGcInputReturn}
          selectedNetwork={selectedNetwork}
          onChangeNetwork={onChangeNetwork}
        />
        {selectedCollection ? (
          <NftList
            selectedCollection={selectedCollection}
            userAddress={userAddress}
            useGcInputReturn={useGcInputReturn}
            selectedNetwork={selectedNetwork}
            setSelectedCollection={setSelectedCollection}
          />
        ) : (
          <NftCollectionList
            setSelectedCollection={setSelectedCollection}
            userAddress={userAddress}
            selectedNetwork={selectedNetwork}
          />
        )}
      </BottomSheet>
    </View>
  ) : (
    <></>
  )
}

export default MyNftList

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#00000018',
    width: '100%',
    height: '100%',
    bottom: 0,
    zIndex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 10,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
