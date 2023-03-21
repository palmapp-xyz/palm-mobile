import React, { ReactElement, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useQueryClient } from 'react-query'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import firestore from '@react-native-firebase/firestore'

import { COLOR, UTIL } from 'consts'
import { FbListing, QueryKeyEnum, SupportedNetworkEnum, zx } from 'types'
import { Container, Header, MediaRenderer, SubmitButton } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useAuth from 'hooks/independent/useAuth'
import useZxCancelNft from 'hooks/zx/useZxCancelNft'
import useZxBuyNft from 'hooks/zx/useZxBuyNft'
import { navigationRef, Routes } from 'libs/navigation'
import useZxOrder from 'hooks/zx/useZxOrder'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import useMoralisNftImage from 'hooks/independent/useNftImage'
import GroupChannelItem from 'components/GroupChannelItem'

const Contents = ({
  selectedNft,
  channelUrl,
}: {
  selectedNft: zx.order
  channelUrl?: string
}): ReactElement => {
  const { user } = useAuth()
  const isMine =
    selectedNft.order.maker.toLocaleLowerCase() ===
    user?.address.toLocaleLowerCase()
  const { navigation } = useAppNavigation()

  const { onClickConfirm: onClickCancel } = useZxCancelNft(channelUrl ?? '')

  const { onClickConfirm: onClickBuy } = useZxBuyNft(channelUrl ?? '')

  const queryClient = useQueryClient()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl || '')

  const { uri } = useMoralisNftImage({
    nftContract: selectedNft.nftToken,
    tokenId: selectedNft.nftTokenId,
  })

  const [activeListedChannels, setActiveListedChannels] = useState<FbListing[]>(
    []
  )

  useAsyncEffect(async () => {
    const activeListings: FbListing[] = []
    try {
      await firestore()
        .collection('listings')
        .doc(selectedNft.nftToken)
        .collection('orders')
        .get()
        .then(ordersSnapshot => {
          ordersSnapshot.forEach(orderSnapshot => {
            const listing = orderSnapshot.data() as FbListing
            if (
              listing.order &&
              listing.status === 'active' &&
              listing.channelUrl
            ) {
              activeListings.push(listing)
            }
          })
        })

      setActiveListedChannels(activeListings)
    } catch (e) {
      console.error(e)
    }
  }, [selectedNft])

  return (
    <View style={styles.body}>
      <View style={styles.imageBox}>
        <MediaRenderer src={uri} width={'100%'} height={250} />
      </View>
      <View style={styles.info}>
        <View style={styles.infoDetails}>
          <View>
            <Text style={styles.headText}>Owner</Text>
            <Text>
              {isMine ? 'Mine' : UTIL.truncate(selectedNft.order.maker)}
            </Text>
          </View>
          <View>
            <Text style={styles.headText}>Token</Text>
            <Text>{selectedNft.order.erc721Token}</Text>
          </View>
          <View>
            <Text style={styles.headText}>Price</Text>
            <Text>{UTIL.formatAmountP(selectedNft.erc20TokenAmount)} ETH</Text>
          </View>
          {isMine && (
            <View>
              <Text style={styles.headText}>
                Active Listings ({activeListedChannels.length})
              </Text>
              {activeListedChannels.length > 0 ? (
                <FlatList
                  data={activeListedChannels}
                  keyExtractor={(_, index): string => `active-listing-${index}`}
                  renderItem={({ item }): ReactElement => {
                    return <GroupChannelItem channelUrl={item.channelUrl} />
                  }}
                />
              ) : (
                <Text>None</Text>
              )}
            </View>
          )}
        </View>
        <SubmitButton
          network={SupportedNetworkEnum.ETHEREUM}
          onPress={async (): Promise<void> => {
            if (isMine) {
              await onClickCancel({ order: selectedNft.order })
            } else {
              const buyRes = await onClickBuy({ order: selectedNft.order })
              if (channel && uri && user && buyRes.success) {
                const imgInfo = await nftUriFetcher(uri)
                imgInfo.data = stringifySendFileData({
                  type: 'buy',
                  selectedNft,
                  buyer: user.address,
                })
                channel.sendFileMessage(imgInfo)
              }
            }
            queryClient.removeQueries([QueryKeyEnum.ZX_ORDERS])

            const currRoute = navigationRef.getCurrentRoute()
            if (
              Routes.ZxNftDetail === currRoute?.name &&
              // @ts-ignore
              selectedNft.order.nonce === currRoute?.params?.nonce
            ) {
              navigation.goBack()
            }
          }}>
          {isMine ? 'Cancel' : 'Buy'}
        </SubmitButton>
      </View>
    </View>
  )
}

const ZxNftDetailScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ZxNftDetail>()
  const { order } = useZxOrder({ nonce: params.nonce })

  return (
    <Container style={styles.container}>
      <Header
        title="Buy NFT"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      {order && <Contents selectedNft={order} channelUrl={params.channelUrl} />}
    </Container>
  )
}

export default ZxNftDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageBox: { width: '100%' },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  infoDetails: { rowGap: 10 },
  headText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
