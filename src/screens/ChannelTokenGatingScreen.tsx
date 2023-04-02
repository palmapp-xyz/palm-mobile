import React, { ReactElement, useMemo, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'
import { utils } from 'ethers'

import { COLOR } from 'consts'

import {
  ChainLogoWrapper,
  Container,
  FormButton,
  FormInput,
  Header,
  MoralisNftPreview,
  Row,
} from 'components'
import { ContractAddr, QueryKeyEnum, SupportedNetworkEnum } from 'types'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'
import useNftImage from 'hooks/independent/useNftImage'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import MediaRenderer, {
  MediaRendererProps,
} from 'components/atoms/MediaRenderer'

const GatingToken = ({
  chain,
  nftContract,
}: {
  chain: SupportedNetworkEnum
  nftContract: ContractAddr
}): ReactElement => {
  const { name } = useNft({ nftContract, chain })
  const { data: tokenName = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_NAME, nftContract, chain],
    name
  )
  const { loading, uri, metadata } = useNftImage({
    nftContract,
    tokenId: '1',
    chain,
  })

  const mediaProps: MediaRendererProps = {
    src: uri,
    width: 40,
    height: 40,
    loading,
    metadata,
  }

  return (
    <Row style={{ alignItems: 'center', columnGap: 10 }}>
      <ChainLogoWrapper chain={chain}>
        <MediaRenderer {...mediaProps} />
      </ChainLogoWrapper>
      <Text style={{ fontSize: 24 }}>{tokenName}</Text>
    </Row>
  )
}

const ChannelTokenGatingScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelTokenGating>()
  const { user } = useAuth()
  const [editGatingToken, setEditGatingToken] = useState<{
    contract: ContractAddr
    chain: SupportedNetworkEnum
  }>({ contract: '' as ContractAddr, chain: SupportedNetworkEnum.ETHEREUM })
  const editGatingTokenErrMsg = useMemo(() => {
    if (editGatingToken) {
      if (utils.isAddress(editGatingToken.contract) === false) {
        return 'Invalid address'
      }
    }
    return ''
  }, [editGatingToken])

  const { fsChannelField, updateGatingToken, isFetching } = useFsChannel({
    channelUrl: params.channelUrl,
  })

  const { nftList } = useUserNftList({
    userAddress: user?.address,
    selectedNetwork: SupportedNetworkEnum.ETHEREUM,
  })
  const groupedNftList = useMemo(
    () =>
      _.map(
        _.groupBy(nftList, x => x.token_address),
        val => val[0]
      ),
    [nftList]
  )

  return (
    <Container style={styles.container}>
      <Header
        title="Token Gating"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              borderBottomColor: COLOR.gray._400,
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginBottom: 10,
            }}>
            <Text>Gating Token</Text>
            {fsChannelField?.gatingToken ? (
              <GatingToken
                chain={SupportedNetworkEnum.ETHEREUM}
                nftContract={fsChannelField?.gatingToken}
              />
            ) : (
              <Text>None</Text>
            )}
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text>Selected NFT</Text>
            <FormInput
              value={editGatingToken.contract}
              onChangeText={(value): void => {
                setEditGatingToken({
                  ...editGatingToken,
                  contract: value as ContractAddr,
                })
              }}
            />
          </View>
          {editGatingTokenErrMsg && (
            <Text style={{ color: COLOR.error }}>{editGatingTokenErrMsg}</Text>
          )}
          <FlatList
            data={groupedNftList}
            keyExtractor={(item, index): string => `groupedNftList-${index}`}
            numColumns={2}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            scrollEnabled={true}
            renderItem={({ item }): ReactElement => (
              <TouchableOpacity
                style={{ flex: 1 / 2 }}
                onPress={(): void => {
                  setEditGatingToken({
                    contract: item.token_address,
                    chain: SupportedNetworkEnum.ETHEREUM,
                  })
                }}>
                <View style={{ borderRadius: 10, flex: 1 }}>
                  <MoralisNftPreview item={item} width={'100%'} height={180} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <FormButton
            disabled={isFetching}
            onPress={(): void => {
              updateGatingToken(editGatingToken.contract, editGatingToken.chain)
            }}>
            Confirm
          </FormButton>
        </View>
      </View>
    </Container>
  )
}

export default ChannelTokenGatingScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, padding: 10, justifyContent: 'space-between' },
})
