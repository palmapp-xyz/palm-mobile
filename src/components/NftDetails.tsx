import { FormButton, LinkExplorer } from 'components'
import MediaRenderer, {
  MediaRendererProps,
} from 'components/molecules/MediaRenderer'
import NftMetadata from 'components/molecules/NftMetadata'
import useAuth from 'hooks/auth/useAuth'
import useNft from 'hooks/contract/useNft'
import useNftImage from 'hooks/independent/useNftImage'
import React, { ReactElement, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { ContractAddr, Moralis, NftType, SupportedNetworkEnum } from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'
import { Maybe } from '@toruslabs/openlogin'

import NftListingChannels from '../screens/NftListingChannels'

const NftDetails = ({
  nftContract,
  tokenId,
  type,
  chain,
  item,
  onSubmit,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  item?: Moralis.NftItem
  onSubmit?: (uri: string | undefined, metadata: Maybe<string>) => Promise<void>
}): ReactElement => {
  const { ownerOf } = useNft({ nftContract, chain })
  const [tokenOwner, setTokenOwner] = useState<ContractAddr>()
  const { user } = useAuth()

  const isMine =
    tokenOwner?.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { loading, uri, metadata, refetch, isRefetching } = useNftImage({
    nftContract,
    tokenId,
    type,
    chain,
    metadata: item?.metadata,
  })

  const nftRenderProps: MediaRendererProps = {
    src:
      uri ||
      item?.media?.media_collection?.high?.url ||
      item?.media?.original_media_url,
    alt: `${nftContract}:${tokenId}`,
    loading,
    height: 300,
  }

  useAsyncEffect(async (): Promise<void> => {
    const owner = await ownerOf({ tokenId })
    setTokenOwner(owner)
  }, [nftContract, tokenId])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View style={styles.body}>
        <View style={styles.imageBox}>
          <MediaRenderer {...nftRenderProps} />
        </View>
        <View style={styles.info}>
          <View style={styles.infoDetails}>
            {tokenOwner && (
              <View style={styles.item}>
                <Text style={styles.headText}>Owner</Text>
                <View style={{ flexDirection: 'row' }}>
                  <LinkExplorer
                    type="address"
                    address={tokenOwner}
                    network={chain}
                  />
                  {isMine && (
                    <Text style={{ marginHorizontal: 5 }}>(Mine)</Text>
                  )}
                </View>
              </View>
            )}
            <View style={styles.item}>
              <Text style={styles.headText}>Token Contract</Text>
              <LinkExplorer
                type="address"
                address={nftContract}
                network={chain}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.headText}>Token ID</Text>
              <LinkExplorer
                type="nft"
                address={nftContract}
                tokenId={tokenId}
                network={chain}
              />
            </View>
            <NftMetadata metadata={metadata} style={styles.item} />
            {isMine && (
              <View style={styles.item}>
                <Text style={styles.headText}>Listed Channels</Text>
                <NftListingChannels
                  nftContract={nftContract}
                  tokenId={tokenId}
                />
              </View>
            )}
          </View>
        </View>
        {onSubmit && (
          <FormButton
            containerStyle={{
              marginBottom: 50,
              marginHorizontal: 30,
              marginTop: 0,
            }}
            onPress={(): Promise<void> => onSubmit(uri, metadata)}
          >
            {isMine ? 'Cancel' : 'Buy'}
          </FormButton>
        )}
      </View>
    </ScrollView>
  )
}

export default NftDetails

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageBox: {
    marginBottom: 10,
    alignItems: 'center',
  },
  item: {
    marginVertical: 3,
  },
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
