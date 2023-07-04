import { Routes } from 'palm-core/libs/navigation'
import { Container, Header } from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react/hooks/app/useAppNavigation'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import NftDetails from '../../components/NftDetails'

const NftDetailScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.NftDetail>()
  const { t } = useTranslation()

  return (
    <Container style={styles.container}>
      <Header
        title={t('Nft.NftInfoHeaderTitle')}
        left="back"
        onPressLeft={navigation.goBack}
      />
      <NftDetails
        nftContract={params.nftContract}
        tokenId={params.tokenId}
        type={params.nftContractType}
        chain={params.chain}
        item={params.item}
      />
    </Container>
  )
}

export default NftDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageBox: { width: '100%', height: 250, marginVertical: 10 },
  item: {
    marginVertical: 3,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  infoDetails: { rowGap: 10 },
  headText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
