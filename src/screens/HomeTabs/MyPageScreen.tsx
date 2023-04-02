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
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import ProfileHeader from '../../components/ProfileHeader'
import { ChainLogoWrapper, MoralisNftPreview, NftItemMenu } from 'components'
import { Moralis, SupportedNetworkEnum } from 'types'
import ProfileFooter from 'components/ProfileFooter'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import useProfile from 'hooks/independent/useProfile'

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

  const { profile, updateProfileImage } = useProfile({ address: user?.address })

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
    if (!profile) {
      return
    }

    const res = await updateProfileImage(selectedItem, selectedNetwork)
    if (res.success) {
      const txHash = res.value
      console.log(`updateProfileImage tx hash ${txHash}`)
      alert({ message: 'Profile image updated' })
    } else {
      console.error(`updateProfileImage error ${res.errMsg}`)
      alert({ message: `Update profile image failed: ${res.errMsg}` })
    }
  }

  return (
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
              nftContractType: item.contract_type,
              chain:
                chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                SupportedNetworkEnum.ETHEREUM,
            })
          }}>
          <View style={{ borderRadius: 10, flex: 1 }}>
            <ChainLogoWrapper chain={selectedNetwork}>
              <MoralisNftPreview
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
