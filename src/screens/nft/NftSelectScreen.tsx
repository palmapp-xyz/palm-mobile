import {
  ChainLogoWrapper,
  Container,
  FormButton,
  FormText,
  Header,
  MoralisNftRenderer,
  SupportedNetworkRow,
} from 'components'
import Indicator from 'components/atoms/Indicator'
import ProfileCollectionNft from 'components/molecules/ProfileCollectionNft'
import { COLOR } from 'core/consts'
import { UTIL } from 'core/libs'
import { recordError } from 'core/libs/logger'
import { Routes } from 'core/libs/navigation'
import { Moralis, SupportedNetworkEnum } from 'core/types'
import useCollectionNfts from 'hooks/api/useCollectionNfts'
import useProfile from 'hooks/auth/useProfile'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'

const NftSelectScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.NftSelect>()
  const { t } = useTranslation()
  const toast = useToast()

  const size = useWindowDimensions()
  const dim = size.width / 3.0 - 18

  const [layoutHeight, setLayoutHeight] = useState(0)

  const [selectedNetwork, setSelectedNetwork] = useState(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollectionNft, setSelectedCollectionNft] =
    useState<Moralis.NftCollection | null>(null)

  const [selectedItem, setSelectedItem] = useState<Moralis.NftItem | null>(null)

  const { user, useMyNftCollectionReturn } = useMyPageMain({
    selectedNetwork,
  })

  const { items, loading, fetchNextPage, hasNextPage } = useCollectionNfts({
    selectedNetwork,
    userAddress: user?.address,
    contractAddress: selectedCollectionNft?.token_address,
    preload: selectedCollectionNft?.preload,
  })

  const { updateProfileImage } = useProfile({
    profileId: user?.auth?.profileId,
  })

  const isCanBeUpdated = (): boolean => {
    const mainnet = UTIL.isMainnet()

    return (
      selectedNetwork &&
      (mainnet
        ? selectedNetwork === SupportedNetworkEnum.ETHEREUM ||
          selectedNetwork === SupportedNetworkEnum.POLYGON
        : selectedNetwork === SupportedNetworkEnum.POLYGON)
    )
  }

  const loadingIndicator = loading ? <Indicator /> : null

  useEffect(() => {
    setSelectedCollectionNft(null)
  }, [selectedNetwork])

  return (
    <Container style={{ flex: 1 }}>
      <Header
        title={t('NftSelect.Title')}
        left="back"
        onPressLeft={navigation.goBack}
      />
      <SupportedNetworkRow
        style={{ margin: 16 }}
        selectedNetwork={selectedNetwork}
        onNetworkSelected={(network): void => {
          setSelectedNetwork(network)
          setSelectedItem(null)
        }}
      />

      {!selectedCollectionNft && (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={useMyNftCollectionReturn.isRefetching}
              onRefresh={async (): Promise<void> => {
                useMyNftCollectionReturn.remove()
                await useMyNftCollectionReturn.refetch()
              }}
            />
          }
          data={useMyNftCollectionReturn.items}
          keyExtractor={(item: Moralis.NftCollection): string =>
            `${user?.address}:${item.token_address}`
          }
          onEndReached={async (): Promise<void> => {
            if (useMyNftCollectionReturn.hasNextPage) {
              await useMyNftCollectionReturn.fetchNextPage()
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, gap: 4 }}
          columnWrapperStyle={{ gap: 8 }}
          renderItem={({
            item,
          }: ListRenderItemInfo<Moralis.NftCollection>): ReactElement => {
            return (
              <ProfileCollectionNft
                collection={item}
                onSelect={(): void => setSelectedCollectionNft(item)}
              />
            )
          }}
        />
      )}

      {selectedCollectionNft && (
        <View style={styles.nftSubTitle}>
          <Pressable
            onPress={(): void => {
              setSelectedCollectionNft(null)
              setSelectedItem(null)
            }}
          >
            <Ionicons
              name="ios-chevron-back"
              color={COLOR.black._400}
              size={16}
            />
          </Pressable>
          <FormText>{selectedCollectionNft?.name}</FormText>
        </View>
      )}

      {selectedCollectionNft && (
        <FlatList
          data={items}
          keyExtractor={(_, index): string => `select-user-ft-list-${index}`}
          initialNumToRender={10}
          contentContainerStyle={{ rowGap: 0 }}
          numColumns={3}
          onEndReached={(): void => {
            if (hasNextPage) {
              fetchNextPage()
            }
          }}
          ListFooterComponent={loadingIndicator}
          style={{ marginHorizontal: 16, marginBottom: layoutHeight }}
          renderItem={({ item }): ReactElement => (
            <TouchableOpacity
              onPress={(): void => {
                setSelectedItem(item)
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  margin: 2,
                }}
              >
                <ChainLogoWrapper
                  chain={selectedNetwork}
                  containerStyle={{
                    width: dim,
                    height: dim,
                    maxWidth: dim,
                  }}
                >
                  <MoralisNftRenderer
                    style={{ borderRadius: 12 }}
                    item={item}
                  />
                  <View style={styles.nftTitle}>
                    <FormText numberOfLines={1}>{`#${item.token_id}`}</FormText>
                  </View>
                </ChainLogoWrapper>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedCollectionNft && params?.type === 'select-profile' && (
        <View
          style={styles.setProfileButton}
          onLayout={(e): void => {
            setLayoutHeight(e.nativeEvent.layout.height)
          }}
        >
          <FormButton
            textStyle={{
              fontWeight: '600',
              color:
                !isCanBeUpdated() || !selectedItem
                  ? COLOR.black._90015
                  : COLOR.primary._400,
            }}
            figure="outline"
            onPress={async (): Promise<void> => {
              if (selectedItem) {
                const res = await updateProfileImage(
                  selectedItem,
                  selectedNetwork
                )

                if (res.success) {
                  const txHash = res.value
                  console.log(`updateProfileImage tx hash ${txHash}`)
                  toast.show(t('NftSelect.UpdateProfileSuccessToast'), {
                    icon: 'check',
                    color: 'green',
                  })
                } else {
                  recordError(`updateProfileImage error ${res.errMsg}`)
                  toast.show(t('NftSelect.UpdateProfileFailureToast'), {
                    icon: 'info',
                    color: 'red',
                  })
                }
              }
              // navigation.goBack()
            }}
            disabled={!isCanBeUpdated() || !selectedItem}
          >
            {t('NftSelect.Select')}
          </FormButton>
        </View>
      )}
    </Container>
  )
}

export default NftSelectScreen

const styles = StyleSheet.create({
  body: { flex: 1, padding: 20, backgroundColor: 'white', gap: 20 },
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
    flex: 1,
  },
  nftSubTitle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  setProfileButton: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
})
