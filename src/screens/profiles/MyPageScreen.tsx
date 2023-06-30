import { Container } from 'components'
import ProfileCollectionNft from 'components/molecules/ProfileCollectionNft'
import ProfileFooter from 'components/ProfileFooter'
import SelectedCollectionNftsSheet from 'components/SelectedCollectionNftsSheet'
import UserTokensSheet from 'components/UserTokensSheet'
import { recordError } from 'core/libs/logger'
import { Moralis, SupportedNetworkEnum } from 'core/types'
import useProfile from 'hooks/auth/useProfile'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
} from 'react-native'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

import ProfileHeader from '../../components/ProfileHeader'

const MyPageScreen = (): ReactElement => {
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const { user, useMyNftCollectionReturn, useMyBalanceReturn } = useMyPageMain({
    selectedNetwork,
  })

  const { alert } = useAlert()
  const { t } = useTranslation()

  const { profile, updateProfileImage } = useProfile({
    profileId: user?.auth?.profileId,
  })

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
      alert({
        message: t('Profiles.MyProfileUpdateImageSuccessAlertMessage'),
      })
    } else {
      recordError(`updateProfileImage error ${res.errMsg}`)
      alert({
        message: t('Profiles.MyProfileUpdateImageSuccessAlertMessage', {
          errMsg: res.errMsg,
        }),
      })
    }
  }

  const [showUserTokensSheet, setShowUserTokensSheet] = useState<boolean>(false)
  const [selectedCollectionNft, setSelectedCollectionNft] =
    useState<Moralis.NftCollection | null>(null)

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

  return (
    <Container style={{ marginBottom: Platform.select({ ios: -30 }) }}>
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
        onEndReached={(): void => {
          if (useMyNftCollectionReturn.hasNextPage) {
            useMyNftCollectionReturn.fetchNextPage()
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

      {showUserTokensSheet ? (
        <UserTokensSheet onClose={(): void => setShowUserTokensSheet(false)} />
      ) : selectedCollectionNft ? (
        <SelectedCollectionNftsSheet
          userAddress={user?.address!}
          selectedCollectionNft={selectedCollectionNft}
          onNftMenuSelected={onNftMenuSelected}
          onClose={(): void => setSelectedCollectionNft(null)}
        />
      ) : null}
    </Container>
  )
}

export default MyPageScreen
