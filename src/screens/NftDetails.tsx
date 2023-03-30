import React, { ReactElement, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { ContractAddr, SupportedNetworkEnum } from 'types'
import { LinkExplorer, SubmitButton } from 'components'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
import NftMetadata from 'components/molecules/NftMetadata'
import useNftImage from 'hooks/independent/useNftImage'
import { MediaRendererProps } from 'components/atoms/MediaRenderer'
import NftMediaRenderer from 'components/molecules/NftMediaRenderer'
import { Maybe } from '@toruslabs/openlogin'
import NftListingChannels from './NftListingChannels'

const NftDetails = ({
  nftContract,
  tokenId,
  chain,
  onSubmit,
}: {
  nftContract: ContractAddr
  tokenId: string
  chain: SupportedNetworkEnum
  onSubmit?: (uri: string | undefined, metadata: Maybe<string>) => Promise<void>
}): ReactElement => {
  const { ownerOf } = useNft({ nftContract, chain })
  const [tokenOwner, setTokenOwner] = useState<ContractAddr>()
  const { user } = useAuth(chain)

  const isMine =
    tokenOwner?.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { loading, uri, metadata, refetch, isRefetching } = useNftImage({
    nftContract,
    tokenId,
    chain,
  })

  const nftRenderProps: MediaRendererProps = {
    src: uri,
    alt: `${nftContract}:${tokenId}`,
    loading,
    metadata,
    style: { flex: 1 },
  }

  useAsyncEffect(async (): Promise<void> => {
    const owner = await ownerOf({ tokenId })
    setTokenOwner(owner)
  }, [nftContract, tokenId])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }>
      <View style={styles.body}>
        <View style={styles.imageBox}>
          <NftMediaRenderer {...nftRenderProps} />
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
              <Text>{tokenId}</Text>
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
          <SubmitButton
            containerStyle={{
              marginBottom: 50,
              marginHorizontal: 30,
              marginTop: 0,
            }}
            network={SupportedNetworkEnum.ETHEREUM}
            onPress={(): Promise<void> => onSubmit(uri, metadata)}>
            {isMine ? 'Cancel' : 'Buy'}
          </SubmitButton>
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
  imageBox: { width: '100%', height: 250, marginBottom: 10 },
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