import React, { ReactElement, useMemo, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/auth/useAuth'
import { SupportedNetworkEnum } from 'types'
import {
  FormText,
  MoralisNftRenderer,
  Row,
  SupportedNetworkRow,
} from 'components'
import BottomMenu from './BottomMenu'

const MyNftList = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { user } = useAuth()
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const { nftList } = useUserNftList({
    userAddress: user?.address,
    selectedNetwork,
  })

  const snapPoints = useMemo(() => [300, '100%'], [])

  const disabledNext = useGcInputReturn.selectedNftList.length < 1

  return useGcInputReturn.stepAfterSelectNft ? (
    <View style={styles.container}>
      <BottomSheet snapPoints={snapPoints} enableOverDrag={false}>
        <Row style={styles.inputHeader}>
          <TouchableOpacity
            onPress={(): void => {
              useGcInputReturn.setOpenBottomMenu(false)
              useGcInputReturn.setStepAfterSelectNft(undefined)
            }}>
            <Icon color={COLOR.primary._400} name={'close-outline'} size={36} />
          </TouchableOpacity>
          {useGcInputReturn.runningNextStep ? (
            <View style={styles.nextStepIcon}>
              <ActivityIndicator size="large" color={COLOR.primary._400} />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.nextStepIcon,
                {
                  backgroundColor: disabledNext
                    ? COLOR.black._50
                    : COLOR.primary._400,
                },
              ]}
              disabled={disabledNext}
              onPress={useGcInputReturn.onClickNextStep}>
              <Icon name="arrow-up" color={'white'} size={24} />
            </TouchableOpacity>
          )}
        </Row>
        <View style={{ paddingHorizontal: 16, rowGap: 8 }}>
          <BottomMenu useGcInputReturn={useGcInputReturn} />
          <SupportedNetworkRow
            selectedNetwork={selectedNetwork}
            onNetworkSelected={setSelectedNetwork}
          />
        </View>
        {nftList.length === 0 && (
          <View style={styles.footer}>
            <FormText style={styles.text}>
              {'The user has no NFTs yet.'}
            </FormText>
          </View>
        )}
        <FlatList
          data={nftList}
          keyExtractor={(_, index): string => `nftList-${index}`}
          style={{ paddingHorizontal: 8, paddingTop: 20 }}
          contentContainerStyle={{ gap: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          numColumns={3}
          renderItem={({ item }): ReactElement => {
            const selectedIndex = useGcInputReturn.selectedNftList.findIndex(
              x =>
                x.token_address === item.token_address &&
                x.token_id === item.token_id
            )

            return (
              <View style={{ flex: 1 / 3, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={(): void => {
                    if (useGcInputReturn.stepAfterSelectNft === 'share') {
                      useGcInputReturn.setSelectedNftList(valOrUpdater => {
                        if (selectedIndex > -1) {
                          return valOrUpdater.filter(x => x !== item)
                        } else {
                          // Send up to N at a time.
                          if (useGcInputReturn.selectedNftList.length < 3) {
                            return [...valOrUpdater, item]
                          } else {
                            return valOrUpdater
                          }
                        }
                      })
                    } else {
                      useGcInputReturn.setSelectedNftList([item])
                    }
                  }}>
                  <MoralisNftRenderer item={item} width={104} height={104} />
                  <View
                    style={[
                      styles.selectItemIcon,
                      {
                        backgroundColor:
                          selectedIndex > -1 ? COLOR.primary._400 : 'white',
                      },
                    ]}>
                    {selectedIndex > -1 && (
                      <FormText fontType="B.12" color="white">
                        {selectedIndex + 1}
                      </FormText>
                    )}
                  </View>
                  <View style={styles.nftTitle}>
                    <FormText
                      numberOfLines={1}
                      style={{ fontSize: 10 }}>{`#${item.token_id}`}</FormText>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
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
