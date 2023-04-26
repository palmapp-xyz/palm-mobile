import {
  Route,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import type { GroupChannelType } from '@sendbird/uikit-react-native'
import type { SendbirdChatSDK } from '@sendbird/uikit-utils'
import {
  AuthChallengeInfo,
  ContractAddr,
  NftType,
  SupportedNetworkEnum,
} from 'types'

import { GetSendbirdSDK } from './sendbird'

export enum Routes {
  MainNavigator = 'MainNavigator',
  AuthNavigator = 'AuthNavigator',

  MainAccount = 'MainAccount',
  Login = 'Login',
  NewAccount = 'NewAccount',
  ConfirmSeed = 'ConfirmSeed',
  RecoverAccount = 'RecoverAccount',
  Web3Auth = 'Web3Auth',

  Sign4Auth = 'Sign4Auth',

  HomeTabs = 'HomeTabs',
  Explore = 'Explore',
  LensFriends = 'LensFriends',
  NftList = 'NftList',
  MyPage = 'MyPage',
  GroupChannelList = 'GroupChannelList',

  UserProfile = 'UserProfile',
  UpdateLensProfile = 'UpdateLensProfile',
  NftDetail = 'NftDetail',
  ZxNftDetail = 'ZxNftDetail',
  InitExplore = 'InitExplore',
  ListNft = 'ListNft',
  SendNft = 'SendNft',
  ChannelListings = 'ChannelListings',
  ChannelTokenGating = 'ChannelTokenGating',

  GroupChannel = 'GroupChannel',
  TokenGatingInfo = 'TokenGatingInfo',

  GroupChannelSettings = 'GroupChannelSettings',
  GroupChannelNotifications = 'GroupChannelNotifications',
  GroupChannelMembers = 'GroupChannelMembers',
  GroupChannelModeration = 'GroupChannelModeration',
  GroupChannelOperators = 'GroupChannelOperators',
  GroupChannelRegisterOperator = 'GroupChannelRegisterOperator',
  GroupChannelMutedMembers = 'GroupChannelMutedMembers',
  GroupChannelBannedUsers = 'GroupChannelBannedUsers',

  GroupChannelCreate = 'GroupChannelCreate',
  GroupChannelInvite = 'GroupChannelInvite',
  Setting = 'Setting',
  FileViewer = 'FileViewer',

  CreateChannel = 'CreateChannel',
}

type AuthRouteParamsUnion =
  | {
      route: Routes.Web3Auth
      params: undefined
    }
  | {
      route: Routes.MainAccount
      params: undefined
    }
  | {
      route: Routes.Login
      params: undefined
    }
  | {
      route: Routes.NewAccount
      params: undefined
    }
  | {
      route: Routes.ConfirmSeed
      params: { mnemonic: string }
    }
  | {
      route: Routes.RecoverAccount
      params: {
        isSignUp: boolean
      }
    }
  | {
      route: Routes.Sign4Auth
      params: {
        challenge: AuthChallengeInfo
      }
    }

type MainRouteParamsUnion =
  | {
      route: Routes.HomeTabs
      params: undefined
    }
  | {
      route: Routes.UpdateLensProfile
      params: undefined
    }
  | {
      route: Routes.Explore
      params: undefined
    }
  | {
      route: Routes.LensFriends
      params: undefined
    }
  | {
      route: Routes.NftList
      params: undefined
    }
  | {
      route: Routes.InitExplore
      params: undefined
    }
  | {
      route: Routes.MyPage
      params: undefined
    }
  | {
      route: Routes.UserProfile
      params: {
        address: ContractAddr // sendbird user id
      }
    }
  | {
      route: Routes.GroupChannelList
      params: { channelUrl?: string } | undefined
    }
  | {
      route: Routes.ZxNftDetail
      params: {
        nonce: string
        channelUrl?: string
        chain: SupportedNetworkEnum
      }
    }
  | {
      route: Routes.NftDetail
      params: {
        nftContract: ContractAddr
        tokenId: string
        nftContractType: NftType
        chain: SupportedNetworkEnum
      }
    }
  | {
      route: Routes.ListNft
      params: { channelUrl: string }
    }
  | {
      route: Routes.SendNft
      params: {
        receiverId: string
        channelUrl?: string
      }
    }
  | {
      route: Routes.ChannelListings
      params: { channelUrl: string }
    }
  | {
      route: Routes.ChannelTokenGating
      params: { channelUrl: string }
    }
  | {
      route: Routes.Setting
      params: undefined
    }
  | {
      route: Routes.GroupChannelCreate
      params: { channelType: GroupChannelType }
    }
  | {
      route: Routes.GroupChannel
      params: { channelUrl: string }
    }
  | {
      route: Routes.TokenGatingInfo
      params: {
        channelUrl: string
      }
    }
  | {
      route: Routes.GroupChannelSettings
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelNotifications
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelMembers
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelModeration
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelOperators
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelRegisterOperator
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelMutedMembers
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelBannedUsers
      params: { channelUrl: string }
    }
  | {
      route: Routes.GroupChannelInvite
      params: { channelUrl: string }
    }
  | {
      route: Routes.FileViewer
      params: {
        serializedFileMessage: object
        deleteMessage: () => Promise<void>
      }
    }
  | {
      route: Routes.CreateChannel
      params: undefined
    }

export type RouteParamsUnion =
  | {
      route: Routes.MainNavigator
      params: undefined
    }
  | {
      route: Routes.AuthNavigator
      params: undefined
    }
  | AuthRouteParamsUnion
  | MainRouteParamsUnion

type ExtractParams<R extends Routes, U extends RouteParamsUnion> = U extends {
  route: R
  params: infer P
}
  ? P
  : never
// type ExtractNavigatorParams<R extends Routes[]> = { [key in R[number]]: ExtractParams<key, RouteParamsUnion> };
export type RouteParams<R extends Routes> = ExtractParams<R, RouteParamsUnion>
export type ParamListBase<T extends RouteParamsUnion = RouteParamsUnion> = {
  [k in T['route']]: T extends { route: k; params: infer P } ? P : never
}

export type RouteProps<
  T extends Routes,
  P extends Record<string, unknown> = Record<string, string>
> = {
  navigation: NativeStackNavigationProp<ParamListBase, T>
  route: Route<T, RouteParams<T>>
} & P

export type ScreenPropsNavigation<T extends Routes> =
  RouteProps<T>['navigation']
export type ScreenPropsRoute<T extends Routes> = RouteProps<T>['route']

export const navigationRef = createNavigationContainerRef<ParamListBase>()
export const navigationActions = {
  navigate<T extends Routes>(name: T, params: RouteParams<T>): void {
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute()
      if (currentRoute?.name === name) {
        // navigationRef.setParams(params);
        navigationRef.dispatch(StackActions.replace(name, params))
      } else {
        // @ts-ignore
        navigationRef.navigate<Routes>(name, params)
      }
    }
  },
  push<T extends Routes>(name: T, params: RouteParams<T>): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params))
    }
  },
  goBack(): void {
    if (navigationRef.isReady()) {
      navigationRef.goBack()
    }
  },
}

export const runAfterAppReady = (
  callback: (sdk: SendbirdChatSDK, actions: typeof navigationActions) => void
): void => {
  const id = setInterval(async () => {
    if (navigationRef.isReady() && GetSendbirdSDK()) {
      const sdk = GetSendbirdSDK()
      if (sdk.connectionState === 'OPEN') {
        clearInterval(id)
        callback(sdk, navigationActions)
      }
    }
  }, 250)
}
