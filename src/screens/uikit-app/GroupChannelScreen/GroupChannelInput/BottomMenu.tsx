import React, { ReactElement, useMemo } from 'react'
import { StyleSheet, Text, Pressable, FlatList, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import { COLOR } from 'consts'

const NUM_COLUMNS = 4

const BottomMenu = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const menuList = useMemo(
    () => [
      {
        icon: 'ios-images',
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('share')
        },
        title: 'Share NFT',
      },
      {
        icon: 'ios-duplicate',
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('sell')
        },
        title: 'Sell NFT',
      },
      {
        icon: 'ios-document-attach-sharp',
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('send')
        },
        title: 'Send NFT',
      },
    ],
    []
  )
  return useGcInputReturn.openBottomMenu ? (
    <View style={styles.container}>
      <FlatList
        data={menuList}
        keyExtractor={(_, index): string => `menuList-${index}`}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{ gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }): ReactElement => {
          return (
            <Pressable style={styles.itemBox} onPress={item.onPress}>
              <View style={styles.iconBox}>
                <Icon color={COLOR.primary._400} name={item.icon} size={30} />
              </View>
              <Text style={{ fontSize: 12 }}>{item.title}</Text>
            </Pressable>
          )
        }}
      />
    </View>
  ) : (
    <></>
  )
}

export default BottomMenu

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    columnGap: 20,
    height: 200,
  },
  itemBox: {
    flex: 1 / NUM_COLUMNS,
    paddingVertical: 10,
    borderRadius: 20,
    rowGap: 10,
    alignItems: 'center',
  },
  iconBox: {
    padding: 20,
    backgroundColor: COLOR.primary._100,
    borderRadius: 15,
  },
})
