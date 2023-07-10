import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { recordError } from 'palm-core/libs/logger'
import { Routes } from 'palm-core/libs/navigation'
import { Moralis, SupportedNetworkEnum } from 'palm-core/types'
import {
  Container,
  FormButton,
  FormText,
  Header,
  SupportedNetworkRow,
} from 'palm-react-native-ui-kit/components'
import NftCollectionList from 'palm-react-native-ui-kit/components/molecules/NftCollectionList'
import ProfileCollectionNft from 'palm-react-native-ui-kit/components/molecules/ProfileCollectionNft'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import useUserNftCollectionList from 'palm-react/hooks/api/useUserNftCollectionList'
import useProfile from 'palm-react/hooks/auth/useProfile'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const NftSelectScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.NftSelect>()
  const { address, profileId } = params
  const { t } = useTranslation()
  const toast = useToast()

  const [layoutHeight, setLayoutHeight] = useState(0)

  const [selectedNetwork, setSelectedNetwork] = useState(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollectionNft, setSelectedCollectionNft] =
    useState<Moralis.NftCollection | null>(null)

  const [selectedItem, setSelectedItem] = useState<Moralis.NftItem | null>(null)

  const useMyNftCollectionReturn = useUserNftCollectionList({
    userAddress: address,
    selectedNetwork,
  })

  const { updateProfileImage } = useProfile({
    profileId: profileId,
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
            `${address}:${item.token_address}`
          }
          onEndReached={async (): Promise<void> => {
            if (useMyNftCollectionReturn.hasNextPage) {
              await useMyNftCollectionReturn.fetchNextPage()
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={12}
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
        <Pressable
          style={styles.nftSubTitle}
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
          <FormText>{selectedCollectionNft?.name}</FormText>
        </Pressable>
      )}

      {selectedCollectionNft && (
        <NftCollectionList
          selectedNetwork={selectedNetwork}
          address={address}
          selectedCollectionNft={selectedCollectionNft}
          layoutHeight={layoutHeight}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
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
