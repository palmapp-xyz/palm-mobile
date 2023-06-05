import { Container } from 'components'
import CollectionNftItemsCollapsible from 'components/molecules/CollectionNftItemsCollapsible'
import ProfileFooter from 'components/ProfileFooter'
import UserTokensSheet from 'components/UserTokensSheet'
import { COLOR } from 'consts'
import useProfile from 'hooks/auth/useProfile'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import { recordError } from 'libs/logger'
import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
} from 'react-native'
import { Moralis, SupportedNetworkEnum } from 'types'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

import ProfileHeader from '../../components/ProfileHeader'

const MyPageScreen = (): ReactElement => {
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const { alert } = useAlert()

  const { user, useMyNftCollectionReturn, useMyBalanceReturn } = useMyPageMain({
    selectedNetwork,
  })

  const [showUserTokensSheet, setShowUserTokensSheet] = useState<boolean>(false)

  const { profile, updateProfileImage } = useProfile({
    profileId: user?.auth?.profileId,
  })

  const profileHeader = (
    <ProfileHeader
      isMyPage
      userProfileId={user?.auth?.profileId}
      userAddress={user?.address}
      selectedNetwork={selectedNetwork}
      onNetworkSelected={setSelectedNetwork}
      onToggleShowUserTokensSheet={(): void => {
        setShowUserTokensSheet(!showUserTokensSheet)
      }}
    />
  )

  const profileFooter = (
    <ProfileFooter useUserAssetsReturn={useMyNftCollectionReturn} />
  )

  const onNftMenuSelected = async (
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
  }

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
      safeAreaBackgroundColor={`${COLOR.black._900}${COLOR.opacity._05}`}
      style={{ marginBottom: Platform.select({ ios: -30 }) }}
    >
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={
              useMyNftCollectionReturn.isRefetching ||
              useMyBalanceReturn.isRefetching
            }
            onRefresh={(): void => {
              useMyBalanceReturn.remove()
              useMyNftCollectionReturn.remove()
              Promise.all([
                useMyNftCollectionReturn.refetch(),
                useMyBalanceReturn.refetch(),
              ])
            }}
          />
        }
        ListHeaderComponent={profileHeader}
        ListFooterComponent={profileFooter}
        data={useMyNftCollectionReturn.items}
        keyExtractor={(item: Moralis.NftCollection): string =>
          `${user?.address}:${item.token_address}`
        }
        contentContainerStyle={{ paddingHorizontal: 4 }}
        onEndReached={(): void => {
          if (useMyNftCollectionReturn.hasNextPage) {
            useMyNftCollectionReturn.fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        renderItem={({
          item,
        }: ListRenderItemInfo<Moralis.NftCollection>): ReactElement => (
          <CollectionNftItemsCollapsible
            userAddress={user?.address}
            contractAddress={item.token_address}
            selectedNetwork={selectedNetwork}
            headerText={`${item.name}${item.symbol ? ` (${item.symbol})` : ''}`}
            onNftMenuSelected={onNftMenuSelected}
          />
        )}
      />

      {showUserTokensSheet && (
        <UserTokensSheet onClose={(): void => setShowUserTokensSheet(false)} />
      )}
    </Container>
  )
}

export default MyPageScreen
