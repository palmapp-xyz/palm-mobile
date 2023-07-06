import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import {
  ContractAddr,
  Moralis,
  NftType,
  QueryKeyEnum,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { FormText, VerifiedWrapper } from 'palm-react-native-ui-kit/components'
import MediaRenderer, {
  MediaRendererProps,
} from 'palm-react-native-ui-kit/components/molecules/MediaRenderer'
import NftAttributes from 'palm-react-native-ui-kit/components/molecules/NftAttributes'
import useReactQuery from 'palm-react/hooks/complex/useReactQuery'
import useNft from 'palm-react/hooks/contract/useNft'
import useNftImage from 'palm-react/hooks/independent/useNftImage'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { useAsyncEffect } from '@sendbird/uikit-utils'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useProfile from 'palm-react/hooks/auth/useProfile'

const NftDetails = ({
  nftContract,
  tokenId,
  type,
  chain,
  item,
  isNftInfo,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  item?: Moralis.NftItem
  isNftInfo?: boolean
}): ReactElement => {
  const { user } = useAuth()
  const { updateProfileImage } = useProfile({
    profileId: user?.auth?.profileId!,
  })
  const { t } = useTranslation()
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

  const checkProfileUpdateAvailable = (): boolean => {
    return (
      !chain &&
      (UTIL.isMainnet()
        ? chain === SupportedNetworkEnum.ETHEREUM ||
          chain === SupportedNetworkEnum.POLYGON
        : chain === SupportedNetworkEnum.POLYGON)
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.body}>
          <View style={{ paddingBottom: 20, rowGap: 12 }}>
            <FormText
              size={18}
              font={'B'}
            >{`${tokenName} #${tokenId}`}</FormText>
            <FormText
              style={{ alignSelf: 'flex-end' }}
              color={COLOR.black._400}
            >
              {isNftInfo
                ? t('Components.NftDetails.Owned', {
                    owner: tokenOwner
                      ? tokenOwner === user?.address
                        ? t('Components.NftDetails.Me')
                        : UTIL.truncate(tokenOwner)
                      : t('Components.NftDetails.Unknown'),
                  })
                : t('Components.NftDetails.ListedBy', {
                    owner: tokenOwner
                      ? UTIL.truncate(tokenOwner)
                      : t('Components.NftDetails.Unknown'),
                  })}
            </FormText>
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
      {isNftInfo && tokenOwner === user?.address && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            paddingVertical: 20,
            paddingHorizontal: 12,
          }}
        >
          <FormButton
            textStyle={{
              fontWeight: '600',
            }}
            figure={'outline'}
            onPress={(): void => {
              item && updateProfileImage(item, chain)
            }}
            disabled={checkProfileUpdateAvailable() ? false : true}
          >
            {t('Components.NftDetails.SetAsTheProfileThumbnail')}
          </FormButton>
        </View>
      )}
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
