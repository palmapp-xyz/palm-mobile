import {
  ContractAddr,
  Moralis,
  NftType,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { PinType } from 'palm-react-native-ui-kit/screens/app/PinScreen'

import { RecoverAccountType } from 'palm-react-native-ui-kit/screens/auth/RecoverAccountScreen'

import {
  createNavigationContainerRef,
  Route,
  StackActions,
} from '@react-navigation/native'

import { GetSendbirdSDK } from './sendbird'

import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { SendbirdChatSDK } from '@sendbird/uikit-utils'
export enum Routes {
  MainNavigator = 'MainNavigator',
  AuthNavigator = 'AuthNavigator',

  MainAccount = 'MainAccount',
  NewAccount = 'NewAccount',
  ConfirmSeed = 'ConfirmSeed',
  CreateComplete = 'CreateComplete',
  RecoverAccount = 'RecoverAccount',
  Web3Auth = 'Web3Auth',
  Sign4Auth = 'Sign4Auth',

  Pin = 'Pin',

  HomeTabs = 'HomeTabs',
  Explore = 'Explore',
  LensFriends = 'LensFriends',
  NftSelect = 'NftSelect',
  MyPage = 'MyPage',
  GroupChannelList = 'GroupChannelList',

  UserProfile = 'UserProfile',
  UpdateProfile = 'UpdateProfile',
  NftDetail = 'NftDetail',
  ZxNftDetail = 'ZxNftDetail',
  InitExplore = 'InitExplore',
  ListNft = 'ListNft',
  SendNft = 'SendNft',
  SendToken = 'SendToken',
  ChannelListings = 'ChannelListings',

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
  ExportWallet = 'ExportWallet',
  FileViewer = 'FileViewer',

  CreateChannel = 'CreateChannel',
  ChannelInfo = 'ChannelInfo',
  EditChannel = 'EditChannel',
  ChannelSetting = 'ChannelSetting',
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
      route: Routes.NewAccount
      params: undefined
    }
  | {
      route: Routes.ConfirmSeed
      params: { mnemonic: string }
    }
  | {
      route: Routes.CreateComplete
      params: undefined
    }
  | {
      route: Routes.RecoverAccount
      params: {
        type: RecoverAccountType
      }
    }
  | {
      route: Routes.Sign4Auth
      params: undefined
    }
  | {
      route: Routes.Pin
      params: {
        type: PinType
        result?: (result: boolean) => Promise<void>
        cancel?: () => void
      }
    }

type MainRouteParamsUnion =
  | {
      route: Routes.HomeTabs
      params: undefined
    }
  | {
      route: Routes.UpdateProfile
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
      route: Routes.NftSelect
      params: { type?: string; address: ContractAddr; profileId: string }
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
        address: ContractAddr
        profileId: string
        channelUrl?: string
        isNavigationPerformedByOperator?: boolean
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
        channelUrl: string
        chain: SupportedNetworkEnum
        item?: Moralis.NftItem
      }
    }
  | {
      route: Routes.NftDetail
      params: {
        nftContract: ContractAddr
        tokenId: string
        nftContractType: NftType
        chain: SupportedNetworkEnum
        item?: Moralis.NftItem
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
      route: Routes.SendToken
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
      route: Routes.Setting
      params: undefined
    }
  | {
      route: Routes.ExportWallet
      params: undefined
    }
  | {
      route: Routes.GroupChannelCreate
      params: { channelType: 'GROUP' }
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
  | {
      route: Routes.ChannelInfo
      params: { channelUrl: string }
    }
  | {
      route: Routes.EditChannel
      params: { channelUrl: string }
    }
  | {
      route: Routes.ChannelSetting
      params: { channelUrl: string }
    }
  | {
      route: Routes.Pin
      params: {
        type: PinType
        result?: (result: boolean) => Promise<void>
        cancel?: () => void
      }
    }
  | {
      route: Routes.RecoverAccount
      params: {
        type: RecoverAccountType
      }
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
