import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormButton from 'components/atoms/FormButton'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import { SbSendNftDataType } from 'types'

import MediaRenderer from '../../atoms/MediaRenderer'
import Row from '../../atoms/Row'
import LinkExplorer from '../../atoms/LinkExplorer'
import useNftImage from 'hooks/independent/useNftImage'
import EthLogoWrapper from '../../molecules/EthLogoWrapper'

const SendNftMessage = ({
  data,
}: {
  data: SbSendNftDataType
}): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft
  const { uri } = useNftImage({
    nftContract: item.token_address,
    tokenId: item.token_id,
    metadata: item.metadata,
  })

  return (
    <View style={styles.container}>
      <EthLogoWrapper>
        <MediaRenderer src={uri} width={'100%'} height={150} />
      </EthLogoWrapper>
      <View style={styles.body}>
        <Row style={{ alignItems: 'center', columnGap: 5 }}>
          <Icon
            name="ios-shield-checkmark"
            color={COLOR.primary._400}
            size={20}
          />
          <Text
            numberOfLines={2}
            style={{ color: 'black' }}>{`${item.name} #${item.token_id}`}</Text>
        </Row>
        <View>
          <Text style={{ color: COLOR.primary._400 }}>Send NFT</Text>
          <LinkExplorer type="account" address={data.from}>
            <Text>{`from : ${UTIL.truncate(data.from)}`}</Text>
          </LinkExplorer>
          <LinkExplorer type="account" address={data.to}>
            <Text>{`to : ${UTIL.truncate(data.to)}`}</Text>
          </LinkExplorer>
        </View>
        <FormButton
          size="sm"
          onPress={(): void => {
            navigation.navigate(Routes.NftDetail, {
              nftContract: item.token_address,
              tokenId: item.token_id,
            })
          }}>
          Details
        </FormButton>
      </View>
    </View>
  )
}

export default SendNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { padding: 10, gap: 10 },
  priceBox: {
    backgroundColor: COLOR.primary._50,
    padding: 10,
    rowGap: 5,
    borderRadius: 10,
  },
  priceRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
