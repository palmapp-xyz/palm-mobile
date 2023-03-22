import React, { ReactElement, useCallback, useState } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableWithoutFeedback,
  RefreshControl,
  useWindowDimensions,
} from 'react-native'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { Moralis, SupportedNetworkEnum } from 'types'
import { Routes } from 'libs/navigation'
import { fetchNftImage } from 'libs/fetchTokenUri'

import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import useLensProfile from 'hooks/lens/useLensProfile'
import useUpdateLensProfileImage from 'hooks/lens/useUpdateLensProfileImage'

import { ChainLogoWrapper, MoralisNftRenderer, NftItemMenu } from 'components'
import ProfileHeader from 'components/ProfileHeader'
import ProfileFooter from 'components/ProfileFooter'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const gap = 4
  const size = useWindowDimensions()

  const { user, useMyNftListReturn, useMyBalanceReturn } = useMyPageMain({
    selectedNetwork,
  })
  const { setCurrentUser, updateCurrentUserInfo } = useSendbirdChat()

  const useLensProfileReturn = useLensProfile({ userAddress: user?.address })
  const { updateProfileImage } = useUpdateLensProfileImage()

  const profileHeader = useCallback(
    () => (
      <ProfileHeader
        isMyPage
        userAddress={user?.address}
        selectedNetwork={selectedNetwork}
        onNetworkSelected={setSelectedNetwork}
      />
    ),
    [user?.address, selectedNetwork]
  )

  const profileFooter = useCallback(
    () => <ProfileFooter useUserNftListReturn={useMyNftListReturn} />,
    [useMyNftListReturn]
  )

  const doUpdateProfileImage = async (
    selectedItem: Moralis.NftItem
  ): Promise<void> => {
    if (useLensProfileReturn.profile) {
      await updateProfileImage({
        profileId: useLensProfileReturn.profile.id,
        url: selectedItem.token_uri,
      })
      // if (res.success) {
      //   const txHash = res.value
      //   console.log(`updateProfileImage tx hash ${txHash}`)
      // } else {
      //   console.error(`updateProfileImage error ${res.errMsg}`)
      // }
    }
    const { image } = await fetchNftImage({
      metadata: selectedItem.metadata,
      tokenUri: selectedItem.token_uri,
    })
    const me = await updateCurrentUserInfo(undefined, image)
    setCurrentUser(me)
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={useMyNftListReturn.isRefetching}
          onRefresh={(): void => {
            useMyNftListReturn.refetch()
            useMyBalanceReturn.refetch()
            useLensProfileReturn.refetch()
          }}
        />
      }
      ListHeaderComponent={profileHeader}
      ListFooterComponent={profileFooter}
      data={useMyNftListReturn.nftList}
      keyExtractor={(_, index): string => `nftList-${index}`}
      numColumns={2}
      contentContainerStyle={{ gap }}
      columnWrapperStyle={{ gap }}
      onEndReached={(): void => {
        if (useMyNftListReturn.hasNextPage) {
          useMyNftListReturn.fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => (
        <TouchableWithoutFeedback
          onPress={(): void => {
            navigation.navigate(Routes.NftDetail, {
              nftContract: item.token_address,
              tokenId: item.token_id,
            })
          }}>
          <View style={{ borderRadius: 10, flex: 1 }}>
            <ChainLogoWrapper chain={selectedNetwork}>
              <MoralisNftRenderer
                item={item}
                width={'100%'}
                height={(size.width - gap) / 2.0}
              />
              <NftItemMenu
                chainId={selectedNetwork}
                item={item}
                triggerComponent={
                  <View style={styles.nftTitle}>
                    <Text numberOfLines={1}>{`#${item.token_id}`}</Text>
                  </View>
                }
                onSelect={async (
                  selectedItem: Moralis.NftItem,
                  selectedOption: string
                ): Promise<void> => {
                  try {
                    if (selectedOption === 'set_nft_profile') {
                      await doUpdateProfileImage(selectedItem)
                    }
                  } catch (e) {
                    console.error(e, selectedItem, selectedOption)
                  }
                }}
              />
            </ChainLogoWrapper>
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  )
}

export default MyPageScreen

const styles = StyleSheet.create({
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
})
