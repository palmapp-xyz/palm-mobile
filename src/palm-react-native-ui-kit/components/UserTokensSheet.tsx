import { COLOR } from 'palm-core/consts'
import { pToken, SupportedNetworkEnum } from 'palm-core/types'
import {
  FormBottomSheet,
  SupportedNetworkRow,
} from 'palm-react-native-ui-kit/components'
import useUserFtList from 'palm-react/hooks/api/useUserFtList'
import useAuth from 'palm-react/hooks/auth/useAuth'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

import Indicator from './atoms/Indicator'
import MoralisErc20Token from './MoralisErc20Token'

const UserTokensSheet = ({
  onClose,
}: {
  onClose: () => void
}): ReactElement => {
  const snapPoints = useMemo(() => ['80%'], [])

  const { user } = useAuth()
  const { t } = useTranslation()

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
        <Indicator />
      ) : items.length === 0 ? (
        <Text style={styles.text}>
          {t('Components.UserTokensSheet.NoTokensToShow')}
        </Text>
      ) : (
        <Text style={styles.text}>
          {t('Components.UserTokensSheet.EndOfList')}
        </Text>
      )}
    </View>
  )

  return (
    <FormBottomSheet
      showBottomSheet={true}
      snapPoints={snapPoints}
      onClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.body}>
          <BottomSheetFlatList
            data={items}
            ListHeaderComponent={listHeaderComponent}
            ListFooterComponent={listFooterComponent}
            keyExtractor={(_, index): string => `user-ft-list-${index}`}
            initialNumToRender={10}
            contentContainerStyle={{ rowGap: 0 }}
            renderItem={({ item }): ReactElement | null => (
              <MoralisErc20Token
                key={`${item.token_address}:${item.chainId}}`}
                item={item}
                value={item.balance as pToken}
              />
            )}
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
