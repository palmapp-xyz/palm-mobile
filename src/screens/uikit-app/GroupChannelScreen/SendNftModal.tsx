import React, { ReactElement, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import DropDownPicker from 'react-native-dropdown-picker'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { Header, FormModal, SubmitButton } from 'components'
import { UseGcReturn } from 'hooks/page/groupChannel/useGc'
import useSendNft from 'hooks/page/groupChannel/useSendNft'
import { Moralis } from 'types'

const ModalContents = ({
  channel,
  selectedNft,
}: {
  channel: GroupChannel
  selectedNft: Moralis.NftItem
}): ReactElement => {
  const {
    receiverList,
    setReceiverList,
    receiver,
    setReceiver,
    isValidForm,
    onClickConfirm,
  } = useSendNft({ selectedNft, channel })
  const [open, setOpen] = useState(false)

  return (
    <View style={styles.body}>
      <View>
        <Text style={{ fontSize: 20 }}>Receiver</Text>
        <DropDownPicker
          placeholder="Select Receiver"
          open={open}
          value={receiver}
          items={receiverList}
          setOpen={setOpen}
          setValue={setReceiver}
          setItems={setReceiverList}
        />
      </View>
      {/* <FlatList
          data={nftList}
          keyExtractor={(_, index): string => `nftList-${index}`}
          horizontal
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }): ReactElement => {
            const selected = selectedNft === item
            return (
              <TouchableOpacity
                style={{
                  height: 100,
                  width: 100,
                  borderColor: selected ? 'blue' : 'gray',
                  borderWidth: selected ? 1 : 0,
                  borderRadius: 20,
                  padding: 10,
                }}
                onPress={(): void => {
                  setSelectedNft(item)
                }}>
                <NftRenderer
                  nftContract={item.token_address}
                  tokenId={item.token_id}
                />
              </TouchableOpacity>
            )
          }}
        /> */}
      <SubmitButton disabled={!isValidForm} onPress={onClickConfirm}>
        Send
      </SubmitButton>
    </View>
  )
}

const SendNftModal = ({
  channel,
  useGcReturn,
}: {
  channel: GroupChannel
  useGcReturn: UseGcReturn
}): ReactElement => {
  const { selectedNft, visibleModal, setVisibleModal } = useGcReturn

  return (
    <FormModal visible={visibleModal === 'send'}>
      <Header
        title="Send NFT"
        left={<Icon icon={'close'} />}
        onPressLeft={(): void => {
          setVisibleModal(undefined)
        }}
      />
      {selectedNft && (
        <ModalContents selectedNft={selectedNft} channel={channel} />
      )}
    </FormModal>
  )
}

export default SendNftModal

const styles = StyleSheet.create({
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
