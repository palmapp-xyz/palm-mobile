import React, { ReactElement, useMemo } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'

import { COLOR } from 'consts'

import { Container, FormImage, Header, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import useNft from 'hooks/contract/useNft'
import useReactQuery from 'hooks/complex/useReactQuery'
import { QueryKeyEnum } from 'types'
import useNftImage from 'hooks/independent/useNftImage'
import images from 'assets/images'
import useAuth from 'hooks/independent/useAuth'

const TokenGatingInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.TokenGatingInfo>()
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const nftContract = params.gatingToken
  const { name } = useNft({ nftContract })

  const { data: tokenName = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_NAME, nftContract],
    async () => name()
  )
  const { uri } = useNftImage({ nftContract, tokenId: '1' })
  const { user } = useAuth()
  const membersWithoutMe = useMemo(
    () => channel?.members.filter(x => x.userId !== user?.address) || [],
    [channel?.members]
  )
  if (!channel) {
    return <></>
  }

  return (
    <Container style={styles.container}>
      <Header
        title={`${tokenName} holders`}
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        <View
          style={{
            backgroundColor: COLOR.primary._100,
            height: 150,
            width: '100%',
          }}
        />
        <View
          style={{
            marginTop: -50,
            backgroundColor: 'white',
            borderWidth: 2,
            width: 120,
            borderRadius: 999,
            borderColor: COLOR.primary._50,
          }}>
          <FormImage source={{ uri }} size={120} />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
          }}>{`${tokenName} holders`}</Text>
        <Row style={{ alignItems: 'center', columnGap: 10 }}>
          <Text
            style={{
              color: COLOR.primary._400,
              padding: 5,
              backgroundColor: COLOR.gray._200,
            }}>
            Exclusive space
          </Text>
          <Text>{membersWithoutMe.length} members</Text>
        </Row>
        <Text style={{ fontSize: 16 }}>Entry requirement</Text>
        <Row style={{ alignItems: 'center', columnGap: 10 }}>
          <FormImage source={{ uri }} size={24} />
          <Text>{nftContract}</Text>
        </Row>
        <View style={{ backgroundColor: COLOR.gray._300, padding: 10 }}>
          <Text>
            You need to meet the above requirement to have access to the space.
          </Text>
        </View>
        <FlatList
          data={membersWithoutMe}
          keyExtractor={(_, index): string => `members-${index}`}
          numColumns={3}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }): ReactElement => {
            const source = item.profileUrl
              ? { uri: item.profileUrl }
              : images.blank_profile
            return (
              <View style={{ alignItems: 'center' }}>
                <FormImage
                  source={source}
                  size={80}
                  style={{ borderRadius: 999 }}
                />
                <Text>{item.nickname}</Text>
              </View>
            )
          }}
        />
      </View>
    </Container>
  )
}

export default TokenGatingInfoScreen

const styles = StyleSheet.create({
  container: {},
  body: { padding: 10, gap: 10 },
})
