import { Routes } from 'palm-core/libs/navigation'
import { FbProfile, Moralis, SupportedNetworkEnum } from 'palm-core/types'
import {
  Container,
  FormBottomSheet,
  FormButton,
  FormText,
} from 'palm-react-native-ui-kit/components'
import ProfileCollectionNft from 'palm-react-native-ui-kit/components/molecules/ProfileCollectionNft'
import ProfileFooter from 'palm-react-native-ui-kit/components/ProfileFooter'
import SelectedCollectionNftsSheet from 'palm-react-native-ui-kit/components/SelectedCollectionNftsSheet'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useUserNftCollectionList from 'palm-react/hooks/api/useUserNftCollectionList'
import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  View,
} from 'react-native'

import { BottomSheetView } from '@gorhom/bottom-sheet'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import useToast from 'palm-react-native/app/useToast'
import useProfile from 'palm-react/hooks/auth/useProfile'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ProfileHeader from '../../components/ProfileHeader'

const UserControlItem = ({
  text,
  onPress,
}: {
  text: string
  onPress: () => void
}): ReactElement => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        height: 44,
        marginVertical: 4,
        marginHorizontal: 20,
        justifyContent: 'center',
      }}
    >
      <FormText style={{ lineHeight: 18 }}>{text}</FormText>
    </View>
  </TouchableOpacity>
)

const UserControlDivider = ({ height }: { height?: number }): ReactElement => (
  <View
    style={{
      height: height ?? 1,
      backgroundColor: COLOR.black._90005,
    }}
  />
)

const useFormBottomSheetSnapPoints = (): {
  snapPoints: (string | number)[]
  handleOnLayout: (event: LayoutChangeEvent) => void
} => {
  const [contentHeight, setContentHeight] = useState(0)

  const handleOnLayout = ({ nativeEvent: { layout } }): void => {
    setContentHeight(layout.height)
  }
  return {
    snapPoints: [
      contentHeight > 0
        ? contentHeight * (Platform.OS === 'ios' ? 1.7 : 1.5)
        : '25%',
    ],
    handleOnLayout,
  }
}

const SimpleUserProfile = ({
  profile,
}: {
  profile?: FbProfile
}): ReactElement => {
  const profileImg = getProfileMediaImg(profile?.picture)

  return (
    <View style={{}}>
      <Avatar uri={profileImg} size={56} />
      <FormText font="B" size={20} color={COLOR.black._900}>
        {profile?.handle}
      </FormText>
      <FormText color={COLOR.black._300}>{profile?.bio}</FormText>
    </View>
  )
}

const ChannelUserControl = ({
  showChannelUserControl,
  setShowChannelUserControl,
  profileId,
  channel,
}: {
  showChannelUserControl: boolean
  setShowChannelUserControl: React.Dispatch<React.SetStateAction<boolean>>
  profileId: string
  channel?: GroupChannel
}): ReactElement => {
  const { navigation } = useAppNavigation<Routes.UserProfile>()
  const toast = useToast()
  const { t } = useTranslation()
  const { profile } = useProfile({ profileId })

  const [selected, setSelected] = useState<'ban' | 'mute' | undefined>(
    undefined
  )

  const { snapPoints, handleOnLayout } = useFormBottomSheetSnapPoints()

  return (
    <FormBottomSheet
      showBottomSheet={showChannelUserControl}
      // snapPoints={['auto']}
      snapPoints={snapPoints}
      onClose={(): void => {
        setSelected(undefined)
        setShowChannelUserControl(false)
      }}
    >
      <BottomSheetView
        style={{
          marginTop: 40,
        }}
        onLayout={handleOnLayout}
      >
        {selected === undefined ? (
          <View>
            <UserControlItem
              text={t('UserProfile.MuteThisUserTitle')}
              onPress={(): void => {
                setSelected('mute')
              }}
            />
            <UserControlDivider />
            <UserControlItem
              text={t('UserProfile.BanThisUserTitle')}
              onPress={(): void => {
                setSelected('ban')
              }}
            />
            <UserControlDivider height={12} />
            <UserControlItem
              text={t('Common.Cancel')}
              onPress={(): void => {
                setShowChannelUserControl(false)
              }}
            />
          </View>
        ) : (
          <View>
            <View style={{ marginHorizontal: 20 }}>
              <FormText
                size={24}
                font="B"
                color={COLOR.black._900}
                style={{ marginBottom: 8 }}
              >
                {t('UserProfile.AreYouSureThisUser', {
                  type: selected === 'ban' ? 'ban' : 'mute',
                })}
              </FormText>
              <FormText color={COLOR.black._400} style={{ marginBottom: 40 }}>
                {selected === 'ban'
                  ? t('UserProfile.BanWarning')
                  : t('UserProfile.MuteWarning')}
              </FormText>
              <SimpleUserProfile profile={profile} />
            </View>
            <UserControlDivider />
            <FormButton
              font="SB"
              containerStyle={{
                borderColor:
                  selected === 'ban' ? COLOR.red : COLOR.primary._400,
                backgroundColor:
                  selected === 'ban' ? COLOR.red : COLOR.primary._400,
                marginHorizontal: 20,
                marginTop: 12,
              }}
              onPress={(): void => {
                selected === 'ban'
                  ? channel
                      ?.banUserWithUserId(profileId)
                      .then(() => {
                        toast.show(
                          t('UserProfile.BanToast', {
                            user: profile?.handle,
                          }),
                          {
                            icon: 'check',
                            color: 'green',
                          }
                        )
                        setShowChannelUserControl(false)
                        navigation.pop()
                      })
                      .catch(err => {
                        toast.show(`${err}`, { icon: 'info', color: 'red' })
                      })
                  : channel
                      ?.muteUserWithUserId(profileId)
                      .then(() => {
                        toast.show(
                          t('UserProfile.MuteToast', {
                            user: profile?.handle,
                          }),
                          {
                            icon: 'check',
                            color: 'green',
                          }
                        )
                        setShowChannelUserControl(false)
                        navigation.pop()
                      })
                      .catch(err => {
                        toast.show(`${err}`, { icon: 'info', color: 'red' })
                      })
              }}
            >
              {selected === 'ban'
                ? t('UserProfile.BanButton')
                : t('UserProfile.MuteButton')}
            </FormButton>
          </View>
        )}
      </BottomSheetView>
    </FormBottomSheet>
  )
}

const UserProfileScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.UserProfile>()
  const { address: userAddress, profileId, channel } = params

  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )
  const [selectedCollectionNft, setSelectedCollectionNft] =
    useState<Moralis.NftCollection | null>(null)

  const useUserNftCollectionReturn = useUserNftCollectionList({
    userAddress,
    selectedNetwork,
  })

  const [showChannelUserControl, setShowChannelUserControl] =
    useState<boolean>(false)

  const profileHeader = (
    <ProfileHeader
      isMyPage={false}
      channel={channel}
      userProfileId={profileId}
      userAddress={userAddress}
      selectedNetwork={selectedNetwork}
      onNetworkSelected={setSelectedNetwork}
      onToggleChannelUserControl={(): void => {
        setShowChannelUserControl(true)
      }}
    />
  )

  const profileFooter = (
    <ProfileFooter useUserAssetsReturn={useUserNftCollectionReturn} />
  )

  return (
    <Container
      style={{ flex: 1, marginBottom: Platform.select({ ios: -30 }) }}
      disableSafeArea
    >
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={useUserNftCollectionReturn.isRefetching}
            onRefresh={(): void => {
              useUserNftCollectionReturn.remove()
              useUserNftCollectionReturn.refetch()
            }}
          />
        }
        ListHeaderComponent={profileHeader}
        ListFooterComponent={profileFooter}
        data={useUserNftCollectionReturn.items}
        keyExtractor={(item: Moralis.NftCollection): string =>
          `${userAddress}:${item.token_address}`
        }
        onEndReached={(): void => {
          if (useUserNftCollectionReturn.hasNextPage) {
            useUserNftCollectionReturn.fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        numColumns={2}
        contentContainerStyle={{ gap: 4 }}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({
          item,
        }: ListRenderItemInfo<Moralis.NftCollection>): ReactElement => {
          return (
            <ProfileCollectionNft
              collection={item}
              onSelect={(): void => setSelectedCollectionNft(item)}
            />
          )
        }}
        style={{ flex: 1 }}
      />

      {selectedCollectionNft && (
        <SelectedCollectionNftsSheet
          userAddress={userAddress!}
          selectedCollectionNft={selectedCollectionNft}
          onClose={(): void => setSelectedCollectionNft(null)}
        />
      )}

      <ChannelUserControl
        showChannelUserControl={showChannelUserControl}
        setShowChannelUserControl={setShowChannelUserControl}
        profileId={profileId}
        channel={channel}
      />
    </Container>
  )
}

export default UserProfileScreen
