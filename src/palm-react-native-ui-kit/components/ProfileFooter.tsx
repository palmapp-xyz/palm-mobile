import { Moralis } from 'palm-core/types'
import { UseUserAssetsReturn } from 'palm-react/hooks/api/useUserNftList'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import FormText from './atoms/FormText'
import Indicator from './atoms/Indicator'

const ProfileFooter = ({
  useUserAssetsReturn,
}: {
  useUserAssetsReturn: UseUserAssetsReturn<
    Moralis.NftItem | Moralis.NftCollection
  >
}): ReactElement => {
  const { t } = useTranslation()
  return (
    <View style={[styles.footer]}>
      {useUserAssetsReturn.loading ? (
        <Indicator />
      ) : useUserAssetsReturn.items.length === 0 ? (
        <FormText style={styles.text}>
          {t('Components.ProfileFooter.HasNoNft')}
        </FormText>
      ) : !useUserAssetsReturn.hasNextPage ? (
        <FormText style={styles.text}>
          {t('Components.ProfileFooter.EndOfList')}
        </FormText>
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
    paddingHorizontal: 8,
  },
  text: {
    color: 'gray',
    textAlign: 'center',
  },
})
