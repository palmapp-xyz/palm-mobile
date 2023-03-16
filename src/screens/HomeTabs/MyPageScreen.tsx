import React, { ReactElement, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableWithoutFeedback,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import ProfileHeader from '../../components/ProfileHeader'
import { MoralisNftRenderer, NftItemMenu } from 'components'
import { fetchNftImage } from 'libs/fetchTokenUri'
import { Moralis } from 'types'
import useLensProfile from 'hooks/lens/useLensProfile'
import { COLOR } from 'consts'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user, useMyNftListReturn, useMyBalanceReturn } = useMyPageMain()
  const { setCurrentUser, updateCurrentUserInfo } = useSendbirdChat()

  const useLensProfileReturn = useLensProfile({ userAddress: user?.address })

  const profileHeader = useCallback(
    () => <ProfileHeader isMyPage userAddress={user?.address} />,
    [user?.address]
  )

  const footer = (
    <View style={[styles.footer]}>
      {useMyNftListReturn.isLoading ? (
        <ActivityIndicator size="large" color={COLOR.primary._50} />
      ) : useMyNftListReturn.nftList.length === 0 ? (
        <Text style={styles.text}>{'The user has no NFTs yet.'}</Text>
      ) : null}
    </View>
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
      ListFooterComponent={footer}
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
            <MoralisNftRenderer item={item} width={'100%'} height={180} />
            <NftItemMenu
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
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  )
}

export default MyPageScreen

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    height: 150,
    justifyContent: 'center',
    gap: 20,
    padding: 10,
  },
  text: {
    color: 'black',
    fontSize: 16,
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
})
