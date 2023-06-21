import MediaRenderer from 'components/molecules/MediaRenderer'
import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import { View } from 'react-native'

import {
  Badge,
  createStyleSheet,
  Icon,
  Text,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'
import { conditionChaining } from '@sendbird/uikit-utils'
import FormText from 'components/atoms/FormText'

type Props = {
  customCover?: React.ReactElement
  coverUrl: string

  title: string

  titleCaption: string
  titleCaptionLeft?: React.ReactElement

  bodyIcon?: keyof typeof Icon.Assets
  body: string

  memberCount?: number
  badgeCount: number
  maxBadgeCount?: number

  frozen?: boolean
  notificationOff?: boolean
  broadcast?: boolean
  mentioned?: boolean
  mentionTrigger?: string
}

const GroupChannelPreview = ({
  customCover,
  coverUrl,
  memberCount,
  badgeCount,
  maxBadgeCount,
  body,
  bodyIcon,
  title,
  titleCaption,
  titleCaptionLeft,
  frozen,
  notificationOff,
  broadcast,
  mentioned,
  mentionTrigger = '@',
}: Props): ReactElement => {
  const { colors } = useUIKitTheme()
  const color = colors.ui.groupChannelPreview

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color.default.none.background },
      ]}
    >
      <View style={styles.coverContainer}>
        {conditionChaining(
          [Boolean(customCover)],
          [
            customCover,
            <MediaRenderer
              style={[
                styles.channelCover,
                { backgroundColor: COLOR.white, borderColor: COLOR.black._100 },
              ]}
              src={coverUrl}
            />,
          ]
        )}
      </View>
      <View style={styles.rightSection}>
        <View style={styles.rightTopSection}>
          <View style={styles.channelInfoContainer}>
            {broadcast && (
              <Icon
                size={16}
                icon={'broadcast'}
                color={colors.secondary}
                containerStyle={styles.channelInfoBroadcast}
              />
            )}
            <FormText
              //subtitle1
              numberOfLines={1}
              fontType="SB.14"
              style={styles.channelInfoTitle}
              color={COLOR.black._900}
            >
              {title}
            </FormText>
            {Boolean(memberCount) && (
              <Text
                caption1
                style={styles.channelInfoMemberCount}
                color={color.default.none.memberCount}
              >
                {memberCount}
              </Text>
            )}
            {frozen && (
              <Icon
                size={16}
                icon={'freeze'}
                color={colors.primary}
                containerStyle={styles.channelInfoFrozen}
              />
            )}
            {notificationOff && (
              <Icon
                size={16}
                icon={'notifications-off-filled'}
                color={colors.onBackground03}
              />
            )}
          </View>
          <View style={styles.titleCaptionContainer}>
            {titleCaptionLeft}
            <Text
              caption2
              color={color.default.none.textTitleCaption}
              style={styles.titleCaptionText}
            >
              {titleCaption}
            </Text>
          </View>
        </View>

        <View style={styles.rightBottomSection}>
          <View style={styles.body}>
            <View style={styles.bodyWrapper}>
              {bodyIcon && (
                <Icon
                  size={18}
                  icon={bodyIcon}
                  color={color.default.none.bodyIcon}
                  containerStyle={[
                    styles.bodyIcon,
                    {
                      backgroundColor:
                        colors.ui.groupChannelPreview.default.none
                          .bodyIconBackground,
                    },
                  ]}
                />
              )}
              <FormText
                //body3
                numberOfLines={2}
                ellipsizeMode={bodyIcon ? 'middle' : 'tail'}
                fontType="R.12"
                style={styles.bodyText}
                color={COLOR.black._400}
              >
                {body}
              </FormText>
            </View>
          </View>
          <View style={styles.unreadContainer}>
            {mentioned && (
              <Text h2 color={COLOR.primary._400} style={styles.unreadMention}>
                {mentionTrigger}
              </Text>
            )}
            {badgeCount > 0 && (
              <Badge
                count={badgeCount}
                maxCount={maxBadgeCount}
                style={{
                  backgroundColor: COLOR.primary._400,
                  borderRadius: 8,
                }}
              />
            )}
          </View>
        </View>
        <Separator color={color.default.none.separator} />
      </View>
    </View>
  )
}

type SeparatorProps = { color: string }
const Separator = ({ color }: SeparatorProps): ReactElement => (
  <View style={[styles.separator, { backgroundColor: color }]} />
)

const styles = createStyleSheet({
  container: {
    height: 76,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContainer: {
    marginLeft: 16,
    marginRight: 16,
  },
  channelCover: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  rightSection: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 16,
  },
  rightTopSection: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  channelInfoContainer: {
    flex: 1,
    marginRight: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  channelInfoBroadcast: {
    marginRight: 4,
  },
  channelInfoTitle: {
    flexShrink: 1,
    marginRight: 4,
  },
  channelInfoMemberCount: {
    paddingTop: 2,
    marginRight: 4,
  },
  channelInfoFrozen: {
    marginRight: 4,
  },
  titleCaptionContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginLeft: 4,
  },
  titleCaptionText: {
    marginTop: 2,
  },
  rightBottomSection: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
  },
  body: {
    marginRight: 4,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bodyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyText: {
    flex: 1,
  },
  bodyIcon: {
    borderRadius: 8,
    width: 26,
    height: 26,
    marginRight: 4,
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadMention: {
    marginRight: 4,
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: -16,
    bottom: 0,
    height: 1,
  },
})

export default GroupChannelPreview
