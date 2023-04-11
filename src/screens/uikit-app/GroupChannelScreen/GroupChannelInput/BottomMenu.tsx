import React, { ReactElement, useMemo } from 'react'
import { StyleSheet, Pressable, FlatList, View } from 'react-native'

import { COLOR } from 'consts'
import {
  StepAfterSelectNftType,
  UseGcInputReturn,
} from 'hooks/page/groupChannel/useGcInput'
import { FormImage, FormText, Row } from 'components'
import images from 'assets/images'

const BottomMenu = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const menuList: {
    key: StepAfterSelectNftType
    icon: JSX.Element
    onPress: () => void
    title: string
  }[] = useMemo(
    () => [
      {
        key: 'list',
        icon: <FormImage source={images.list} />,
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('list')
          useGcInputReturn.setSelectedNftList([])
        },
        title: 'List NFT',
      },
      {
        key: 'share',
        icon: <FormImage source={images.NFT} />,
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('share')
          useGcInputReturn.setSelectedNftList([])
        },
        title: 'Show NFT',
      },
      {
        key: 'send',
        icon: <FormImage source={images.arrow_right} />,
        onPress: (): void => {
          useGcInputReturn.setStepAfterSelectNft('send')
          useGcInputReturn.setSelectedNftList([])
        },
        title: 'Send NFT',
      },
      {
        key: 'album',
        icon: <FormImage source={images.image} />,
        onPress: (): void => {
          useGcInputReturn.onPressAttachment()
        },
        title: 'Album',
      },
    ],
    []
  )
  return useGcInputReturn.openBottomMenu ? (
    <View style={styles.container}>
      <FlatList
        data={menuList}
        keyExtractor={(_, index): string => `menuList-${index}`}
        horizontal
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }): ReactElement => {
          const selected = item.key === useGcInputReturn.stepAfterSelectNft
          return (
            <Pressable onPress={item.onPress}>
              <Row
                style={[
                  styles.itemBox,
                  {
                    backgroundColor: selected ? COLOR.main_light : 'white',
                  },
                ]}>
                <View>{item.icon}</View>
                <FormText fontType="B.12" color={COLOR.primary._400}>
                  {item.title}
                </FormText>
              </Row>
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
  container: { paddingBottom: 8 },
  itemBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    columnGap: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.main_light,
  },
})
