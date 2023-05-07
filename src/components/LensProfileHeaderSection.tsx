import { FormText, Row } from 'components'
import { Profile, ProfileStats } from 'graphqls/__generated__/graphql'
import React, { ReactElement } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import LensProfileAttribute from './LensProfileAttribute'

export type LensProfileHeaderSectionProps = {
  lensProfile: Profile
}

const LensProfileHeaderSection = ({
  lensProfile,
}: LensProfileHeaderSectionProps): ReactElement => {
  const stats: ProfileStats = lensProfile.stats

  return (
    <View>
      <Row style={{ alignItems: 'center', columnGap: 8 }}>
        <Row>
          <FormText fontType="R.12" style={styles.statsKey}>
            Followers
          </FormText>
          <FormText fontType="B.12">{stats.totalFollowers}</FormText>
        </Row>
        <FormText fontType="R.12">∙</FormText>
        <Row>
          <FormText fontType="R.12" style={styles.statsKey}>
            Following
          </FormText>
          <FormText fontType="B.12">{stats.totalFollowing}</FormText>
        </Row>
      </Row>
      {!!lensProfile?.attributes?.length && (
        <FlatList
          data={lensProfile.attributes}
          keyExtractor={(item, index): string =>
            `${lensProfile.handle}-attribute-${index}`
          }
          style={styles.attributeList}
          numColumns={2}
          renderItem={({
            item,
          }: {
            item: { key: string; value: string }
          }): ReactElement | null => <LensProfileAttribute attribute={item} />}
        />
      )}
    </View>
  )
}

export default LensProfileHeaderSection

const styles = StyleSheet.create({
  attributeList: {
    flex: 1,
    marginTop: 12,
  },
  attribute: {
    flex: 1,
    marginBottom: 12,
  },
  statsKey: {
    marginEnd: 4,
  },
  attributeKey: {
    marginBottom: 4,
  },
})
