import { FormText } from 'components'
import { Attribute } from 'graphqls/__generated__/graphql'
import { isValidHttpUrl } from 'libs/utils'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import Link from './atoms/Link'

export type LensProfileAttributeProps = {
  attribute: Attribute
}

const LensProfileAttribute = ({
  attribute: { key, value },
}: LensProfileAttributeProps): ReactElement | null => {
  if (key === 'app') {
    return null
  }

  return (
    <View style={styles.attribute}>
      <FormText fontType="B.12" style={styles.attributeKey}>
        {key}
      </FormText>
      {key === 'twitter' ? (
        <Link text={`@${value}`} url={`https://twitter.com/${value}`} />
      ) : isValidHttpUrl(value) ? (
        <Link text={value} url={value} />
      ) : (
        <FormText fontType="R.12">{value}</FormText>
      )}
    </View>
  )
}

export default LensProfileAttribute

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