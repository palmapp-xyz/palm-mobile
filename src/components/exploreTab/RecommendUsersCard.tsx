import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { Card, FormImage, FormText, Row } from 'components'
import { UserItem } from 'hooks/page/explore/useExploreRecommendUsers'
import { UTIL } from 'consts'

const RecommendUsersCard = ({ user }: { user: UserItem }): ReactElement => {
  const follower = UTIL.abbreviateNumber(user.follower.toString())
  const following = UTIL.abbreviateNumber(user.following.toString())
  return (
    <Card>
      <Row style={styles.userBox}>
        <View style={styles.userThumb}>
          <FormImage source={user.img} size={72} />
        </View>
        <View style={{ flex: 1, rowGap: 8 }}>
          <FormText fontType="B.16" numberOfLines={1}>
            {user.name}
          </FormText>
          <View>
            <Row style={{ columnGap: 8, alignItems: 'center' }}>
              <Row>
                <FormText fontType="SB.12">followers</FormText>
                <FormText fontType="B.12">
                  {' '}
                  {`${follower.value}${follower.unit}`}
                </FormText>
              </Row>
              <FormText fontType="B.12">∙</FormText>
              <Row>
                <FormText fontType="SB.12">following</FormText>
                <FormText fontType="B.12">
                  {' '}
                  {`${following.value}${following.unit}`}
                </FormText>
              </Row>
            </Row>
            <Row>
              <FormText fontType="SB.12">NFT</FormText>
              <FormText fontType="B.12"> {user.nftTotalAmount}</FormText>
            </Row>
          </View>
        </View>
      </Row>
    </Card>
  )
}

export default RecommendUsersCard

const styles = StyleSheet.create({
  userThumb: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  userBox: {
    columnGap: 20,
    alignItems: 'center',
  },
})
