import { COLOR } from 'consts'
import { UseUserNftListReturn } from 'hooks/api/useUserNftList'
import React, { ReactElement } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

const ProfileFooter = ({
  useUserNftListReturn,
}: {
  useUserNftListReturn: UseUserNftListReturn
}): ReactElement => {
  return (
    <View style={[styles.footer]}>
      {useUserNftListReturn.isLoading ? (
        <ActivityIndicator size="small" color={COLOR.primary._400} />
      ) : useUserNftListReturn.nftList.length === 0 ? (
        <Text style={styles.text}>{'The user has no NFTs yet.'}</Text>
      ) : !useUserNftListReturn.hasNextPage ? (
        <Text style={styles.text}>{'End of List'}</Text>
      ) : null}
    </View>
  )
}

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
