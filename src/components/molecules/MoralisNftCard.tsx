import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'

import { Moralis, QueryKeyEnum } from 'types'
import useReactQuery from 'hooks/complex/useReactQuery'
import { fetchNftImage } from 'libs/fetchTokenUri'

const MoralisNftCard = ({ item }: { item: Moralis.NftItem }): ReactElement => {
  const { data: uri } = useReactQuery(
    [QueryKeyEnum.MORALIS_NFT_IMAGE, item.token_address, item.token_id],
    () => fetchNftImage({ metadata: item.metadata, tokenUri: item.token_uri })
  )

  return (
    <View style={{ rowGap: 5 }}>
      <Text>{`Img : ${uri}`}</Text>
      <Text>{`ID : ${item.token_id}`}</Text>
      <Text>{item.name}</Text>
    </View>
  )
}

export default MoralisNftCard
