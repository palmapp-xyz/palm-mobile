import React, { ReactElement, useMemo } from 'react'
import { StyleSheet, Text, Pressable, FlatList, View } from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'

const NUM_COLUMNS = 4

const BottomMenu = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const menuList = useMemo(
    () => [
      {
        icon: 'reply',
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('share')
        },
        title: 'Show NFT',
      },
      {
        icon: 'photo',
        onPress: (): void => {},
        title: 'List NFT',
      },
      {
        icon: 'unarchive',
        onPress: (): void => {},
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
              <Icon color={'#2960FF'} icon={item.icon as any} size={24} />
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
    padding: 20,
    columnGap: 20,
    height: 200,
  },
  itemBox: {
    flex: 1 / NUM_COLUMNS,
    paddingVertical: 10,
    borderRadius: 20,
    rowGap: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
})
