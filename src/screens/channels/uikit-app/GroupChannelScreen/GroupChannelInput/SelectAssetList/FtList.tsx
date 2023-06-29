import { FormText } from 'components'
import Indicator from 'components/atoms/Indicator'
import MoralisErc20Token from 'components/MoralisErc20Token'
import { COLOR, UTIL } from 'core/consts'
import useUserFtList from 'hooks/api/useUserFtList'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ContractAddr, pToken } from 'types'

const FtList = ({
  useGcInputReturn,
  userAddress,
}: {
  useGcInputReturn: UseGcInputReturn
  userAddress?: ContractAddr
}): ReactElement => {
  const { selectedNetwork, selectedToken, setSelectedToken } = useGcInputReturn

  const { items, status } = useUserFtList({
    userAddress,
    selectedNetwork,
  })

  const listFooterComponent = (
    <View style={{ paddingTop: 16 }}>
      {status === 'loading' ? (
        <Indicator />
      ) : items.length === 0 ? (
        <Text style={styles.text}>{'No tokens to show'}</Text>
      ) : (
        <Text style={styles.text}>{'End of List'}</Text>
      )}
    </View>
  )

  return (
    <FlatList
      data={items}
      ListFooterComponent={listFooterComponent}
      keyExtractor={(_, index): string => `user-ft-list-${index}`}
      initialNumToRender={10}
      contentContainerStyle={{ rowGap: 0, padding: 16 }}
      renderItem={({ item }): ReactElement | null => {
        if (
          !(
            Number(
              UTIL.formatAmountP(item.balance as pToken, {
                toFix: 4,
              })
            ) > 0
          )
        ) {
          return null
        }
        const selected = selectedToken?.token_address === item.token_address
        return (
          <TouchableOpacity
            onPress={(): void => {
              setSelectedToken(item)
            }}
          >
            <MoralisErc20Token
              key={`${item.token_address}:${item.chainId}}`}
              item={item}
              value={item.balance as pToken}
            />
            <View
              style={[
                styles.selectItemIcon,
                {
                  backgroundColor: selected ? COLOR.primary._400 : 'white',
                },
              ]}
            >
              {selected && (
                <FormText font={'B'} color="white">
                  ✓
                </FormText>
              )}
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

export default FtList

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
  },
  selectItemIcon: {
    position: 'absolute',
    top: 22,
    right: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.primary._400,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
