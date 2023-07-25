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
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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

const SimpleUserProfile = ({
  profile,
}: {
  profile?: FbProfile
}): ReactElement => {
  const profileImg = getProfileMediaImg(profile?.picture)

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLOR.black._90010,
        marginBottom: 20,
      }}
    >
      <View style={{ backgroundColor: COLOR.black._90005, height: 80 }}>
        <View style={{ position: 'absolute', left: 20, bottom: -12 }}>
          <Avatar uri={profileImg} size={56} />
        </View>
      </View>
      <View style={{ margin: 20 }}>
        <FormText font="B" size={20} color={COLOR.black._900}>
          {profile?.handle}
        </FormText>
        <FormText
          color={COLOR.black._300}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {profile?.bio}
        </FormText>
      </View>
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

  const snapPoints = selected ? ['60%'] : ['30%']

  const { bottom } = useSafeAreaInsets()

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
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: Platform.select({ ios: bottom + 20 }),
        }}
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
                marginBottom: Platform.select({ android: 20 }),
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
