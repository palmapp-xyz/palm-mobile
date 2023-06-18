import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Member } from '@sendbird/chat/groupChannel'
import images from 'assets/images'
import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  RadioIcon,
  Row,
} from 'components'
import { COLOR } from 'consts'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

const SelectReceiverModal = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { t } = useTranslation()
  const snapPoints = useMemo(() => ['70%'], [])
  const [selectUser, setSelectUser] = useState<Member>()

  return (
    <FormBottomSheet
      showBottomSheet={useGcInputReturn.openSelectReceiver}
      snapPoints={snapPoints}
      onClose={(): void => {
        setSelectUser(undefined)
        useGcInputReturn.setOpenSelectReceiver(false)
      }}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <Row
            style={{ alignItems: 'center', columnGap: 8, paddingBottom: 18 }}
          >
            <FormText fontType="B.24">
              {t('Channels.UiKitReceiverModalNftTo')}
            </FormText>
            {selectUser ? (
              <FormText fontType="B.24">{selectUser.nickname}</FormText>
            ) : (
              <FormText fontType="B.24" color={COLOR.black._200}>
                {t('Channels.UiKitReceiverModalWhom')}
              </FormText>
            )}
          </Row>
          <BottomSheetFlatList
            data={useGcInputReturn.receiverList}
            keyExtractor={(_, index): string => `receiverList-${index}`}
            contentContainerStyle={{ rowGap: 16 }}
            renderItem={({ item }): ReactElement => {
              const source = item.profileUrl
                ? { uri: item.profileUrl }
                : images.blank_profile

              return (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={(): void => {
                    setSelectUser(item)
                  }}
                >
                  <Row
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 12,
                    }}
                  >
                    <View style={{ borderRadius: 999, overflow: 'hidden' }}>
                      <FormImage source={source} size={40} />
                    </View>
                    <FormText fontType="R.14" numberOfLines={1}>
                      {item.nickname}
                    </FormText>
                  </Row>
                  <RadioIcon selected={item.userId === selectUser?.userId} />
                </TouchableOpacity>
              )
            }}
          />
        </View>
        <View style={styles.footer}>
          <FormButton
            disabled={!selectUser?.userId}
            onPress={(): void => {
              selectUser?.userId &&
                useGcInputReturn.onPressSend({ receiverId: selectUser.userId })
              setSelectUser(undefined)
            }}
          >
            Select
          </FormButton>
        </View>
      </View>
    </FormBottomSheet>
  )
}

export default SelectReceiverModal

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
})
