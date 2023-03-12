import React, { ReactElement } from 'react'
import {
  FlatList,
  View,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native'

import { Routes } from 'libs/navigation'
import { MoralisNftRenderer } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useUserNftList from 'hooks/api/useUserNftList'
import useUserBalance from 'hooks/independent/useUserBalance'
import useLens from 'hooks/independent/useLens'
import useReactQuery from 'hooks/complex/useReactQuery'
import ProfileHeader from './HomeTabs/ProfileHeader'
const UserProfileScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.UserProfile>()
  const userAddress = params.address

  const useUserNftListReturn = useUserNftList({
    userAddress,
  })
  const { balance, refetch: balanceRefetch } = useUserBalance({
    address: userAddress,
  })

  const { getDefaultProfile } = useLens()

  const { data: profile } = useReactQuery(
    ['getDefaultProfile', userAddress],
    () => getDefaultProfile(userAddress)
  )

  const profileHeader = <ProfileHeader profile={profile} balance={balance} />

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={useUserNftListReturn.isRefetching}
          onRefresh={(): void => {
            useUserNftListReturn.refetch()
            balanceRefetch()
          }}
        />
      }
      ListHeaderComponent={profileHeader}
      data={useUserNftListReturn.nftList}
      keyExtractor={(_, index): string => `nftList-${index}`}
      numColumns={2}
      contentContainerStyle={{ gap: 10 }}
      columnWrapperStyle={{ gap: 10 }}
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
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  )
}

export default UserProfileScreen
