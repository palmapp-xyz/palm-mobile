import images from 'assets/images'
import { FormImage, FormText, Row } from 'components'
import { COLOR } from 'consts'
import {
  StepAfterSelectNftType,
  UseGcInputReturn,
} from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement, useMemo } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native'

const BottomMenu = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { receiverList, setOpenSelectReceiver } = useGcInputReturn
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
        onPress: useGcInputReturn.onPressList,
        title: 'List NFT',
      },
      {
        key: 'share',
        icon: <FormImage source={images.NFT} />,
        onPress: useGcInputReturn.onPressShow,
        title: 'Show NFT',
      },
      {
        key: 'send',
        icon: <FormImage source={images.arrow_right} />,
        onPress: (): void => {
          if (receiverList.length > 1) {
            setOpenSelectReceiver(true)
          } else if (receiverList.length === 1) {
            useGcInputReturn.onPressSend({ receiverId: receiverList[0].userId })
          } else {
            Alert.alert('No one to send NFT')
          }
        },
        title: 'Send NFT',
      },
      {
        key: 'album',
        icon: <FormImage source={images.image_blue} />,
        onPress: (): void => {
          useGcInputReturn.onPressAttachment()
        },
        title: 'Album',
      },
    ],
    [receiverList]
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
                ]}
              >
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
