import { COLOR } from 'consts'
import { UseUserAssetsReturn } from 'hooks/api/useUserNftList'
import React, { ReactElement } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Moralis } from 'types'

const ProfileFooter = React.memo(
  ({
    useUserAssetsReturn,
  }: {
    useUserAssetsReturn: UseUserAssetsReturn<
      Moralis.NftItem | Moralis.NftCollection
    >
  }): ReactElement => {
    return (
      <View style={[styles.footer]}>
        {useUserAssetsReturn.isLoading ? (
          <ActivityIndicator size="small" color={COLOR.primary._400} />
        ) : useUserAssetsReturn.items.length === 0 ? (
          <Text style={styles.text}>{'The user has no NFTs yet.'}</Text>
        ) : !useUserAssetsReturn.hasNextPage ? (
          <Text style={styles.text}>{'End of List'}</Text>
        ) : null}
      </View>
    )
  }
)

export default ProfileFooter

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 10,
    height: 70,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
