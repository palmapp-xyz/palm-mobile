import {
  ChainLogoWrapper, Container, FormButton, FormInput, Header, MoralisNftRenderer, Row
} from 'components'
import MediaRenderer, { MediaRendererProps } from 'components/molecules/MediaRenderer'
import { COLOR } from 'consts'
import { utils } from 'ethers'
import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/auth/useAuth'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useNftImage from 'hooks/independent/useNftImage'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import _ from 'lodash'
import React, { ReactElement, useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ContractAddr, NftType, QueryKeyEnum, SupportedNetworkEnum } from 'types'

const GatingToken = ({
  chain,
  nftContract,
  type,
}: {
  chain: SupportedNetworkEnum
  nftContract: ContractAddr
  type: NftType
}): ReactElement => {
  const { name } = useNft({ nftContract, chain })
  const { data: tokenName = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_NAME, nftContract, chain],
    name
  )
  const { loading, uri } = useNftImage({
    nftContract,
    tokenId: '1',
    type,
    chain,
  })

  const mediaProps: MediaRendererProps = {
    src: uri,
    width: 40,
    height: 40,
    loading,
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
    type: NftType
    chain: SupportedNetworkEnum
  }>({
    contract: '' as ContractAddr,
    type: NftType.ERC721,
    chain: SupportedNetworkEnum.ETHEREUM,
  })
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
        left="back"
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              borderBottomColor: COLOR.black._400,
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginBottom: 10,
            }}>
            <Text>Gating Token</Text>
            {fsChannelField?.gating &&
            fsChannelField?.gating?.gatingType === 'NFT' ? (
              <GatingToken
                chain={SupportedNetworkEnum.ETHEREUM}
                type={fsChannelField.gating.tokenType}
                nftContract={fsChannelField.gating.tokenAddress}
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
                    type: item.contract_type,
                    chain: SupportedNetworkEnum.ETHEREUM,
                  })
                }}>
                <View style={{ borderRadius: 10, flex: 1 }}>
                  <MoralisNftRenderer item={item} width={'100%'} height={180} />
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
