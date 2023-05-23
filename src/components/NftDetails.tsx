import { FormText, VerifiedWrapper } from 'components'
import MediaRenderer, {
  MediaRendererProps,
} from 'components/molecules/MediaRenderer'
import NftAttributes from 'components/molecules/NftAttributes'
import { COLOR } from 'consts'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import useNftImage from 'hooks/independent/useNftImage'
import React, { ReactElement, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import {
  ContractAddr,
  Moralis,
  NftType,
  QueryKeyEnum,
  SupportedNetworkEnum,
} from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'

const NftDetails = ({
  nftContract,
  tokenId,
  type,
  chain,
  item,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  item?: Moralis.NftItem
}): ReactElement => {
  const { ownerOf } = useNft({ nftContract, chain })
  const [tokenOwner, setTokenOwner] = useState<ContractAddr>()
  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([])

  const { loading, uri, metadata, refetch, isRefetching } = useNftImage({
    nftContract,
    tokenId,
    type,
    chain,
    metadata: item?.metadata,
  })

  const { name } = useNft({ nftContract, chain })

  const { data: tokenName = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_NAME, nftContract, chain],
    async () => name()
  )

  const nftRenderProps: MediaRendererProps = {
    src:
      uri ||
      item?.media?.media_collection?.high?.url ||
      item?.media?.original_media_url,
    alt: `${nftContract}:${tokenId}`,
    loading,
    height: 300,
    width: '100%',
  }

  useAsyncEffect(async (): Promise<void> => {
    const owner = await ownerOf({ tokenId })
    setTokenOwner(owner)
  }, [nftContract, tokenId])

  useEffect(() => {
    try {
      setAttributes(JSON.parse(metadata || '')?.attributes)
    } catch {}
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.body}>
          <View style={{ paddingBottom: 20, rowGap: 12 }}>
            <FormText fontType="B.18">{`${tokenName} #${tokenId}`}</FormText>
            <FormText
              style={{ alignSelf: 'flex-end' }}
              fontType="R.12"
              color={COLOR.black._400}
            >{`Listed by ...${tokenOwner?.slice(-5)}`}</FormText>
          </View>
          <VerifiedWrapper style={{ left: 32 }}>
            <View style={styles.imageBox}>
              <MediaRenderer {...nftRenderProps} />
            </View>
          </VerifiedWrapper>
          <View style={styles.info}>
            <NftAttributes attributes={attributes} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default NftDetails

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  imageBox: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    alignItems: 'center',
  },
  item: {
    marginVertical: 3,
  },
  info: {},
})
