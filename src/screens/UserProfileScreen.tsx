import { Container, MoralisNftRenderer } from 'components'
import ProfileFooter from 'components/ProfileFooter'
import { COLOR } from 'consts'
import useUserNftList from 'hooks/api/useUserNftList'
import useUserBalance from 'hooks/independent/useUserBalance'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement, useCallback, useState } from 'react'
import {
  FlatList,
  Platform,
  RefreshControl,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SupportedNetworkEnum } from 'types'

import ProfileHeader from '../components/ProfileHeader'

const UserProfileScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.UserProfile>()
  const { address: userAddress, profileId } = params

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const useUserNftListReturn = useUserNftList({
    userAddress,
    selectedNetwork,
  })
  const { refetch: balanceRefetch } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.ETHEREUM,
  })

  const profileHeader = useCallback(
    () => (
      <ProfileHeader
        isMyPage={false}
        userProfileId={profileId}
        userAddress={userAddress}
        selectedNetwork={selectedNetwork}
        onNetworkSelected={setSelectedNetwork}
      />
    ),
    [userAddress]
  )

  const profileFooter = useCallback(
    () => <ProfileFooter useUserNftListReturn={useUserNftListReturn} />,
    [userAddress]
  )

  const gap = 4

  return (
    <Container
      safeAreaBackgroundColor={`${COLOR.black._900}${COLOR.opacity._05}`}
      style={{ marginBottom: Platform.select({ ios: -30 }) }}
    >
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={useUserNftListReturn.isRefetching}
            onRefresh={(): void => {
              useUserNftListReturn.remove()
              Promise.all([useUserNftListReturn.refetch(), balanceRefetch()])
            }}
          />
        }
        ListHeaderComponent={profileHeader}
        ListFooterComponent={profileFooter}
        data={useUserNftListReturn.nftList.filter(x => !!x)}
        keyExtractor={(_, index): string => `nftList-${index}`}
        numColumns={2}
        contentContainerStyle={{ rowGap: gap }}
        columnWrapperStyle={{ columnGap: gap / 2, paddingHorizontal: gap / 2 }}
        onEndReached={(): void => {
          if (useUserNftListReturn.hasNextPage) {
            useUserNftListReturn.fetchNextPage()
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
            }}
          >
            <View style={{ borderRadius: 10, flex: 1 }}>
              <MoralisNftRenderer item={item} width={'100%'} height={180} />
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </Container>
  )
}

export default UserProfileScreen
