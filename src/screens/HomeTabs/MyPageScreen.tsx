import { ChainLogoWrapper, Container, MoralisNftRenderer, NftItemMenu } from 'components'
import ProfileFooter from 'components/ProfileFooter'
import { COLOR } from 'consts'
import useProfile from 'hooks/auth/useProfile'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { recordError } from 'libs/logger'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement, useCallback, useState } from 'react'
import {
  FlatList, RefreshControl, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View
} from 'react-native'
import { Moralis, SupportedNetworkEnum } from 'types'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

import ProfileHeader from '../../components/ProfileHeader'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const gap = 4
  const size = useWindowDimensions()
  const { alert } = useAlert()

  const { user, useMyNftListReturn, useMyBalanceReturn } = useMyPageMain({
    selectedNetwork,
  })

  const { profile, updateProfileImage } = useProfile({
    profileId: user?.auth?.profileId,
  })

  const profileHeader = useCallback(
    () => (
      <ProfileHeader
        isMyPage
        userProfileId={user?.auth?.profileId}
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
    if (!profile) {
      return
    }

    const res = await updateProfileImage(selectedItem, selectedNetwork)
    if (res.success) {
      const txHash = res.value
      console.log(`updateProfileImage tx hash ${txHash}`)
      alert({ message: 'Profile image updated' })
    } else {
      recordError(`updateProfileImage error ${res.errMsg}`)
      alert({ message: `Update profile image failed: ${res.errMsg}` })
    }
  }

  return (
    <Container
      safeAreaBackgroundColor={`${COLOR.black._900}${COLOR.opacity._05}`}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={useMyNftListReturn.isRefetching}
            onRefresh={(): void => {
              useMyNftListReturn.remove()
              Promise.all([
                useMyNftListReturn.refetch(),
                useMyBalanceReturn.refetch(),
              ])
            }}
          />
        }
        ListHeaderComponent={profileHeader}
        ListFooterComponent={profileFooter}
        data={useMyNftListReturn.nftList.filter(x => !!x)}
        keyExtractor={(_, index): string => `nftList-${index}`}
        numColumns={2}
        contentContainerStyle={{ rowGap: 8 }}
        columnWrapperStyle={{ columnGap: 16, paddingHorizontal: 20 }}
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
                nftContractType: item.contract_type,
                chain:
                  chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                  SupportedNetworkEnum.ETHEREUM,
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
                      recordError(e, 'doUpdateProfileImage')
                    }
                  }}
                />
              </ChainLogoWrapper>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </Container>
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
