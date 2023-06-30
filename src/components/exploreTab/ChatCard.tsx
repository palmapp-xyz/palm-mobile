import { Card, FormText, Row, Tag } from 'components'
import ChannelMembersPreview from 'components/sendbird/ChannelMembersPreview'
import { COLOR, NETWORK, UTIL } from 'core/consts'
import { ChannelType, FbChannel } from 'core/types'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const ChatCard = ({
  chat,
  onClick,
}: {
  chat: FbChannel
  onClick: (value: FbChannel) => void
}): ReactElement | null => {
  const { t } = useTranslation()
  if (chat.channelType === ChannelType.DIRECT) {
    return null
  }

  return (
    <Card
      borderRound={true}
      style={{ backgroundColor: `${COLOR.black._200}${COLOR.opacity._10}` }}
    >
      <Pressable onPress={(): void => onClick(chat)}>
        <ChannelMembersPreview channelUrl={chat.url} size={56} />
        <View style={styles.section}>
          <FormText font={'SB'}>{chat.name}</FormText>
        </View>
        <View style={styles.section}>
          <Row style={{ flexWrap: 'wrap', gap: 4 }}>
            {_.map(chat.tags, (item, index) => (
              <Tag key={`chat.tags-${index}`} title={item} />
            ))}
          </Row>
        </View>
        {!!chat.gating?.amount && (
          <View style={styles.section}>
            <Row style={styles.gatingTokeBox}>
              <Icon color={COLOR.black._100} size={16} name="alert-circle" />
              {/* <FormImage source={chat.gating.img} size={40} /> */}

              <Row>
                <FormText color={COLOR.black._500} font={'B'}>
                  {`${chat.gating.amount} `}
                </FormText>
                <FormText color={COLOR.black._500}>
                  {t('Components.ChatCard.Of')}
                </FormText>
                {chat.gating.gatingType === 'Native' ? (
                  <View>
                    <FormText font={'B'}>
                      {` ${NETWORK.nativeToken[chat.gating.chain]}`}
                    </FormText>
                  </View>
                ) : (
                  <View>
                    <FormText font={'B'}>
                      {UTIL.truncate(chat.gating.tokenAddress)}
                    </FormText>
                  </View>
                )}
                <FormText>{t('Components.ChatCard.RequiredToJoin')}</FormText>
              </Row>
            </Row>
          </View>
        )}
      </Pressable>
    </Card>
  )
}

export default ChatCard

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
  },
  tagItem: {
    backgroundColor: COLOR.black._50,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  gatingTokeBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLOR.black._90010,
    columnGap: 8,
    alignItems: 'center',
  },
})
