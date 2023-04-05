import React, { ReactElement } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { GroupChannel } from '@sendbird/chat/groupChannel'

import { UTIL } from 'consts'

import { FormModal } from 'components'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { ContractAddr } from 'types'

const SelectReceiverModal = ({
  useGcInputReturn,
  channel,
}: {
  useGcInputReturn: UseGcInputReturn
  channel: GroupChannel
}): ReactElement => {
  const { navigation } = useAppNavigation()

  return (
    <FormModal visible={useGcInputReturn.openSelectReceiver} transparent>
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={{ fontSize: 20, paddingBottom: 10 }}>
            Select Receiver
          </Text>
          <FlatList
            data={useGcInputReturn.receiverList}
            keyExtractor={(_, index): string => `receiverList-${index}`}
            renderItem={({ item }): ReactElement => {
              return (
                <TouchableOpacity
                  style={styles.user}
                  onPress={(): void => {
                    useGcInputReturn.setOpenSelectReceiver(false)
                    navigation.navigate(Routes.SendNft, {
                      receiver: item.userId as ContractAddr,
                      channelUrl: channel.url,
                    })
                  }}>
                  <Text style={{ fontSize: 20 }} numberOfLines={1}>
                    {item.nickname}
                  </Text>
                  <Text numberOfLines={1}>{UTIL.truncate(item.userId)}</Text>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </FormModal>
  )
}

export default SelectReceiverModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000001a',
    justifyContent: 'flex-end',
  },
  body: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  user: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    padding: 10,
  },
})
