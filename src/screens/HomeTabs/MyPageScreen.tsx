import React, { ReactElement, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import ProfileHeader from '../../components/ProfileHeader'
import {
  ChainLogoWrapper,
  MediaRenderer,
  MoralisNftRenderer,
  NftItemMenu,
} from 'components'
import { fetchNftImage } from 'libs/fetchTokenUri'
import { Moralis, SupportedNetworkEnum } from 'types'
import useLensProfile from 'hooks/lens/useLensProfile'
import ProfileFooter from 'components/ProfileFooter'
import useLens from 'hooks/lens/useLens'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user, useMyNftListReturn, useMyBalanceReturn } = useMyPageMain()
  const { setCurrentUser, updateCurrentUserInfo } = useSendbirdChat()

  const useLensProfileReturn = useLensProfile({ userAddress: user?.address })
  const { updateProfileImage } = useLens()

  const profileHeader = useCallback(
    () => <ProfileHeader isMyPage userAddress={user?.address} />,
    [user?.address]
  )

  const profileFooter = useCallback(
    () => <ProfileFooter useUserNftListReturn={useMyNftListReturn} />,
    [useMyNftListReturn]
  )

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
      contentContainerStyle={{ gap: 10 }}
      columnWrapperStyle={{ gap: 10 }}
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
            <ChainLogoWrapper
              chain={
                chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                SupportedNetworkEnum.ETHEREUM
              }>
              <MoralisNftRenderer item={item} width={'100%'} height={180} />
              <NftItemMenu
                chainId={
                  item.chainId
                    ? chainIdToSupportedNetworkEnum(item.chainId)
                    : undefined
                }
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
                      if (useLensProfileReturn.profile) {
                        const res = await updateProfileImage(
                          useLensProfileReturn.profile.id,
                          selectedItem.token_address,
                          selectedItem.token_id,
                          SupportedNetworkEnum.ETHEREUM
                        )
                        if (res.success) {
                          const txHash = res.value
                          console.log(`updateProfileImage tx hash ${txHash}`)
                        } else {
                          console.error(
                            `updateProfileImage error ${res.errMsg}`
                          )
                        }
                      }
                      const url = await fetchNftImage({
                        metadata: selectedItem.metadata,
                        tokenUri: selectedItem.token_uri,
                      })
                      const me = await updateCurrentUserInfo(undefined, url)
                      setCurrentUser(me)
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
