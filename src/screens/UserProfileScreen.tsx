import { Container } from 'components'
import CollectionNftItemsCollapsible from 'components/molecules/CollectionNftItemsCollapsible'
import ProfileFooter from 'components/ProfileFooter'
import { COLOR } from 'consts'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import useUserBalance from 'hooks/independent/useUserBalance'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
} from 'react-native'
import { Moralis, SupportedNetworkEnum } from 'types'

import ProfileHeader from '../components/ProfileHeader'

const UserProfileScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.UserProfile>()
  const { address: userAddress, profileId } = params

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const useUserNftCollectionReturn = useUserNftCollectionList({
    userAddress,
    selectedNetwork,
  })
  const useUserBalanceReturn = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.ETHEREUM,
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
    <Container
      safeAreaBackgroundColor={`${COLOR.black._900}${COLOR.opacity._05}`}
      style={{ marginBottom: Platform.select({ ios: -30 }) }}
    >
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={
              useUserNftCollectionReturn.isRefetching ||
              useUserBalanceReturn.isRefetching
            }
            onRefresh={(): void => {
              useUserBalanceReturn.remove()
              useUserNftCollectionReturn.remove()
              Promise.all([
                useUserNftCollectionReturn.refetch(),
                useUserBalanceReturn.refetch(),
              ])
            }}
          />
        }
        ListHeaderComponent={profileHeader}
        ListFooterComponent={profileFooter}
        data={useUserNftCollectionReturn.items.filter(x => !!x)}
        keyExtractor={(item: Moralis.NftCollection): string =>
          `${userAddress}:${item.token_address}`
        }
        contentContainerStyle={{ rowGap: 8, paddingHorizontal: 4 }}
        onEndReached={(): void => {
          if (useUserNftCollectionReturn.hasNextPage) {
            useUserNftCollectionReturn.fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        renderItem={({
          item,
        }: ListRenderItemInfo<Moralis.NftCollection>): ReactElement => (
          <CollectionNftItemsCollapsible
            userAddress={userAddress}
            contractAddress={item.token_address}
            selectedNetwork={selectedNetwork}
            headerText={`${item.name}${item.symbol ? ` (${item.symbol})` : ''}`}
          />
        )}
      />
    </Container>
  )
}

export default UserProfileScreen
