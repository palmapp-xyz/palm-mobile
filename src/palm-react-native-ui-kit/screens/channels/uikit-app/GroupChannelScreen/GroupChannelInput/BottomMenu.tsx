import { COLOR } from 'palm-core/consts'
import { FormImage, FormText, Row } from 'palm-react-native-ui-kit/components'
import useToast from 'palm-react-native/app/useToast'
import {
  StepAfterSelectItemType,
  UseGcInputReturn,
} from 'palm-react/hooks/page/groupChannel/useGcInput'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'

const BottomMenu = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { receiverList, setOpenSelectReceiver } = useGcInputReturn
  const { t } = useTranslation()
  const toast = useToast()

  const menuList: {
    key: StepAfterSelectItemType
    icon: JSX.Element
    onPress: () => void
    title: string
  }[] = useMemo(
    () => [
      // {
      //   key: 'list',
      //   icon: <FormImage source={images.list} />,
      //   onPress: useGcInputReturn.onPressList,
      //   title: t('Channels.UiKitBottomMenuTitleListNft'),
      // },
      {
        key: 'share',
        icon: <FormImage source={images.NFT} />,
        onPress: useGcInputReturn.onPressShow,
        title: t('Channels.UiKitBottomMenuTitleShowNft'),
      },
      {
        key: 'send-nft',
        icon: <FormImage source={images.arrow_right} />,
        onPress: (): void => {
          if (receiverList.length > 1) {
            setOpenSelectReceiver('send-nft')
          } else if (receiverList.length === 1) {
            useGcInputReturn.onPressSend({
              stepAfterSelectItem: 'send-nft',
              receiverId: receiverList[0].userId,
            })
          } else {
            toast.show(
              t('Channels.UiKitBottomMenuSendNftNoOneToSendNftToast'),
              { icon: 'info', color: 'red' }
            )
          }
        },
        title: t('Channels.UiKitBottomMenuTitleSendNft'),
      },
      {
        key: 'send-token',
        icon: <FormImage source={images.arrow_right} />,
        onPress: (): void => {
          if (receiverList.length > 1) {
            setOpenSelectReceiver('send-token')
          } else if (receiverList.length === 1) {
            useGcInputReturn.onPressSend({
              stepAfterSelectItem: 'send-token',
              receiverId: receiverList[0].userId,
            })
          } else {
            toast.show(
              t('Channels.UiKitBottomMenuSendNftNoOneToSendTokenToast'),
              { icon: 'info', color: 'red' }
            )
          }
        },
        title: 'Send Token',
      },
      {
        key: 'album',
        icon: <FormImage source={images.image_blue} />,
        onPress: (): void => {
          useGcInputReturn.onPressAttachment()
        },
        title: t('Channels.UiKitBottomMenuTitleAlbum'),
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
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }): ReactElement => {
          const selected = item.key === useGcInputReturn.stepAfterSelectItem
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
                <FormText font={'SB'} color={COLOR.primary._400}>
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
