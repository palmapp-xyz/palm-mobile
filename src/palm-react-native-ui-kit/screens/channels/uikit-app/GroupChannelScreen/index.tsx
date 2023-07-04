import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'
import { UTIL } from 'palm-core/libs'
import { getListingDoc } from 'palm-core/libs/firebase'
import { Routes } from 'palm-core/libs/navigation'
import { parseMsgData } from 'palm-core/libs/sendbird'
import { Moralis, SupportedNetworkEnum } from 'palm-core/types'
import { MessageRenderer } from 'palm-react-native-ui-kit/components'
import ChannelGatingChecker from 'palm-react-native-ui-kit/components/ChannelGatingChecker'
import { useAppNavigation } from 'palm-react/hooks/app/useAppNavigation'
import useFsChannel from 'palm-react/hooks/firestore/useFsChannel'
import React, { ReactElement, useCallback, useMemo } from 'react'
import { AvoidSoftInput } from 'react-native-avoid-softinput'

import { useFocusEffect } from '@react-navigation/native'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import GroupChannelHeader from './GroupChannelHeader'
import GroupChannelInput from './GroupChannelInput'

const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
  Header: GroupChannelHeader,
})

const HasGatingToken = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  return (
    <ChannelGatingChecker
      channelUrl={params.channelUrl}
      onCompleteCheck={({ accessible }): void => {
        if (accessible === false) {
          navigation.replace(Routes.TokenGatingInfo, {
            channelUrl: params.channelUrl,
          })
        }
      }}
    />
  )
}

const Contents = ({ channel }: { channel: GroupChannel }): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setAdjustNothing()
    AvoidSoftInput.setEnabled(true)
    return () => {
      AvoidSoftInput.setEnabled(false)
      AvoidSoftInput.setDefaultAppSoftInputMode()
    }
  }, [])

  useFocusEffect(onFocusEffect)

  const onPressMediaMessage = async (
    fileMessage,
    deleteMessage
  ): Promise<void> => {
    const parsedData = parseMsgData(fileMessage.data || '')
    if (!parsedData || parsedData.type === 'send-token') {
      return
    }
    if (parsedData) {
      const item = parsedData.selectedNft
      const chain: SupportedNetworkEnum =
        UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
        SupportedNetworkEnum.ETHEREUM

      switch (parsedData.type) {
        case 'list':
          const listing = await getListingDoc(parsedData.nonce)
          if (listing?.status === 'active') {
            navigation.push(Routes.ZxNftDetail, {
              nonce: parsedData.nonce,
              channelUrl: params.channelUrl,
              chain:
                UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                SupportedNetworkEnum.ETHEREUM,
              item: item as Moralis.NftItem,
            })
          } else {
            navigation.push(Routes.NftDetail, {
              nftContract: (item as Moralis.NftItem).token_address,
              tokenId: (item as Moralis.NftItem).token_id,
              nftContractType: (item as Moralis.NftItem).contract_type,
              chain,
              item: item as Moralis.NftItem,
            })
          }
          return
        case 'buy':
          const fbListing = await getListingDoc(
            (item as PostOrderResponsePayload).order.nonce
          )
          if (fbListing?.status === 'active') {
            navigation.push(Routes.ZxNftDetail, {
              nonce: (item as PostOrderResponsePayload).order.nonce,
              channelUrl: params.channelUrl,
              chain:
                UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                SupportedNetworkEnum.ETHEREUM,
            })
          } else {
            navigation.push(Routes.NftDetail, {
              nftContract: (item as Moralis.NftItem).token_address,
              tokenId: (item as Moralis.NftItem).token_id,
              nftContractType: (item as Moralis.NftItem).contract_type,
              chain,
              item: item as Moralis.NftItem,
            })
          }
          return
        case 'share':
        case 'send-nft':
          navigation.push(Routes.NftDetail, {
            nftContract: (item as Moralis.NftItem).token_address,
            tokenId: (item as Moralis.NftItem).token_id,
            nftContractType: (item as Moralis.NftItem).contract_type,
            chain,
            item: item as Moralis.NftItem,
          })
          return
      }
    }

    // Navigate to media viewer
    navigation.navigate(Routes.FileViewer, {
      serializedFileMessage: fileMessage.serialize(),
      deleteMessage,
    })
    return
  }

  return (
    <GroupChannelFragment
      keyboardAvoidOffset={-280}
      enableTypingIndicator={true}
      channel={channel}
      onPressMediaMessage={onPressMediaMessage}
      onChannelDeleted={(): void => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList)
      }}
      onPressHeaderLeft={(): void => navigation.goBack()}
      onPressHeaderRight={(): void => {
        // Navigate to group channel settings
        navigation.push(Routes.GroupChannelSettings, params)
      }}
      renderMessage={(props): ReactElement | null => (
        <MessageRenderer {...props} />
      )}
    />
  )
}

const GroupChannelScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.GroupChannel>()
  const { sdk } = useSendbirdChat()

  const { channel } = useGroupChannel(sdk, params.channelUrl)

  const { fsChannel, fsChannelField } = useFsChannel({
    channelUrl: params.channelUrl,
  })
  const gating = useMemo(() => fsChannelField?.gating, [fsChannelField])

  if (!channel || !fsChannel || !fsChannelField) {
    return <></>
  }

  return (
    <>
      {channel.myRole !== 'operator' && gating?.amount && <HasGatingToken />}
      <Contents channel={channel} />
    </>
  )
}

export default GroupChannelScreen
