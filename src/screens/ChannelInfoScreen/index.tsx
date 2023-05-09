import images from 'assets/images'
import { Container, FormImage, FormText, Header, Row, Tag } from 'components'
import LoadingPage from 'components/atoms/LoadingPage'
import { COLOR, UTIL } from 'consts'
import useChannelInfo from 'hooks/page/groupChannel/useChannelInfo'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

const ChannelInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelInfo>()
  const useChannelReturn = useChannelInfo({ channelUrl: params.channelUrl })

  const { channelImage, tags, channelName, desc, gatingToken, loading } =
    useChannelReturn

  if (loading) {
    return <LoadingPage />
  }

  return (
    <>
      <Container style={styles.container} scrollable={true}>
        <Header left="back" onPressLeft={navigation.goBack} />
        <View style={styles.imageSection}>
          <View style={{ borderRadius: 999, overflow: 'hidden' }}>
            <FormImage
              source={channelImage ? { uri: channelImage } : images.NFT_black}
              size={100}
            />
          </View>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Chat Room Name
            </FormText>
            <FormText fontType="R.12">{channelName}</FormText>
          </View>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Description
            </FormText>
            <FormText fontType="R.12" style={{ height: 100 }}>
              {desc ?? 'No description available for this channel.'}
            </FormText>
          </View>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Tags
            </FormText>
            <ScrollView style={{ maxHeight: 80 }}>
              <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                {_.map(tags, (tag, index) => {
                  return <Tag key={`inputTagList-${index}`} title={tag} />
                })}
              </Row>
            </ScrollView>
          </View>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Token Gating
            </FormText>

            {gatingToken && (
              <View style={styles.tokenGatingBox}>
                <FormText fontType="R.14">{gatingToken.name}</FormText>
                <FormText fontType="R.14" color={COLOR.black._200}>
                  {`(minimum: ${UTIL.setComma(gatingToken.amount)})`}
                </FormText>
              </View>
            )}
          </View>
        </View>
      </Container>
    </>
  )
}

export default ChannelInfoScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: {
    height: 240,
    backgroundColor: COLOR.black._90005,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    rowGap: 20,
    padding: 20,
  },
  infoRow: {
    rowGap: 4,
  },
  tokenGatingBox: {
    rowGap: 4,
    flex: 1,
    flexDirection: 'row',
    height: 88,
    backgroundColor: COLOR.black._90005,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    columnGap: 16,
  },
})
