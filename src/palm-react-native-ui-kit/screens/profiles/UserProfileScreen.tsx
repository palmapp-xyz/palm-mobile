import { Routes } from 'palm-core/libs/navigation'
import { Moralis, SupportedNetworkEnum } from 'palm-core/types'
import { Container } from 'palm-react-native-ui-kit/components'
import ProfileCollectionNft from 'palm-react-native-ui-kit/components/molecules/ProfileCollectionNft'
import ProfileFooter from 'palm-react-native-ui-kit/components/ProfileFooter'
import SelectedCollectionNftsSheet from 'palm-react-native-ui-kit/components/SelectedCollectionNftsSheet'
import useUserNftCollectionList from 'palm-react/hooks/api/useUserNftCollectionList'
import { useAppNavigation } from 'palm-react/hooks/useAppNavigation'
import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
} from 'react-native'

import ProfileHeader from '../../components/ProfileHeader'

const UserProfileScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.UserProfile>()
  const { address: userAddress, profileId } = params

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollectionNft, setSelectedCollectionNft] =
    useState<Moralis.NftCollection | null>(null)

  const useUserNftCollectionReturn = useUserNftCollectionList({
    userAddress,
    selectedNetwork,
  })

  const profileHeader = (
    <ProfileHeader
      isMyPage={false}
      userProfileId={profileId}
      userAddress={userAddress}
      selectedNetwork={selectedNetwork}
      onNetworkSelected={setSelectedNetwork}
    />
  )

  const profileFooter = (
    <ProfileFooter useUserAssetsReturn={useUserNftCollectionReturn} />
  )

  return (
    <Container style={{ marginBottom: Platform.select({ ios: -30 }) }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={useUserNftCollectionReturn.isRefetching}
            onRefresh={(): void => {
              useUserNftCollectionReturn.remove()
              useUserNftCollectionReturn.refetch()
            }}
          />
        }
        ListHeaderComponent={profileHeader}
        ListFooterComponent={profileFooter}
        data={useUserNftCollectionReturn.items}
        keyExtractor={(item: Moralis.NftCollection): string =>
          `${userAddress}:${item.token_address}`
        }
        onEndReached={(): void => {
          if (useUserNftCollectionReturn.hasNextPage) {
            useUserNftCollectionReturn.fetchNextPage()
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

      {selectedCollectionNft && (
        <SelectedCollectionNftsSheet
          userAddress={userAddress!}
          selectedCollectionNft={selectedCollectionNft}
          onClose={(): void => setSelectedCollectionNft(null)}
        />
      )}
    </Container>
  )
}

export default UserProfileScreen
