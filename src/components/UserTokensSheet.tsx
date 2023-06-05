import { FormBottomSheet, SupportedNetworkRow } from 'components'
import { COLOR } from 'consts'
import useUserFtList from 'hooks/api/useUserFtList'
import useAuth from 'hooks/auth/useAuth'
import React, { ReactElement, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SupportedNetworkEnum } from 'types'

import MoralisErc20Token from './MoralisErc20Token'

const UserTokensSheet = ({
  onClose,
}: {
  onClose: () => void
}): ReactElement => {
  const snapPoints = useMemo(() => ['80%'], [])

  const { user } = useAuth()

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const { items, status } = useUserFtList({
    userAddress: user?.address,
    selectedNetwork,
  })

  const listHeaderComponent = (
    <SupportedNetworkRow
      selectedNetwork={selectedNetwork}
      onNetworkSelected={setSelectedNetwork}
      style={{ marginBottom: 10 }}
    />
  )

  const listFooterComponent = (
    <View style={{ paddingTop: 16 }}>
      {status === 'loading' ? (
        <ActivityIndicator color={COLOR.primary._400} />
      ) : items.length === 0 ? (
        <Text style={styles.text}>{'No tokens to show'}</Text>
      ) : (
        <Text style={styles.text}>{'End of List'}</Text>
      )}
    </View>
  )

  return (
    <FormBottomSheet
      showBottomSheet={true}
      snapPoints={snapPoints}
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: COLOR.black._10,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.body}>
          <FlatList
            data={items}
            ListHeaderComponent={listHeaderComponent}
            ListFooterComponent={listFooterComponent}
            keyExtractor={(_, index): string => `user-ft-list-${index}`}
            initialNumToRender={10}
            contentContainerStyle={{ rowGap: 0 }}
            renderItem={({ item }): ReactElement | null => {
              if (item.possible_spam) {
                return null
              }
              return (
                <MoralisErc20Token
                  item={item}
                  selectedNetwork={selectedNetwork}
                />
              )
            }}
          />
        </View>
      </View>
    </FormBottomSheet>
  )
}

export default UserTokensSheet

const styles = StyleSheet.create({
  body: { flex: 1, padding: 20, backgroundColor: 'white', gap: 20 },
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
