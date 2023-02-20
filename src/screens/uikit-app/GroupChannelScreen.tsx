import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

/**
 * Example for customize navigation header with DomainContext
 * Component should return null for hide uikit header
 *
 * Especially in GroupChannel (chatting view)
 * you should provide your custom header height to GroupChannel as a keyboardAvoidOffset prop
 * to fix Input component position properly (when focused)
 *
 * @example
 * ```
 * import React, { useContext, useEffect } from 'react';
 * import { Pressable } from 'react-native';
 *
 * import { useNavigation } from "@react-navigation/native";
 * import { useHeaderHeight } from '@react-navigation/elements';
 *
 * import { GroupChannelContexts, GroupChannelModule } from '@sendbird/uikit-react-native';
 * import { Icon } from '@sendbird/uikit-react-native-foundation';
 *
 * const UseReactNavigationHeader: GroupChannelModule['Header'] = ({ onPressHeaderRight, onPressHeaderLeft }) => {
 *   const navigation = useNavigation();
 *   const { headerTitle } = useContext(GroupChannelContexts.Fragment);
 *   useEffect(() => {
 *     navigation.setOptions({
 *       headerShown: true,
 *       headerTitleAlign: 'center',
 *       title: headerTitle,
 *       headerLeft: () => (
 *         <Pressable onPress={onPressHeaderLeft}>
 *           <Icon icon={'arrow-left'} />
 *         </Pressable>
 *       ),
 *       headerRight: () => (
 *         <Pressable onPress={onPressHeaderRight}>
 *           <Icon icon={'info'} />
 *         </Pressable>
 *       ),
 *     });
 *   }, []);
 *   return null;
 * };
 *
 * const GroupChannelFragment = createGroupChannelFragment({ Header: UseReactNavigationHeader });
 *
 * const GroupChannelScreen = () => {
 *   // ...
 *   const height = useHeaderHeight();
 *
 *   return (
 *     <GroupChannelFragment
 *       keyboardAvoidOffset={height}
 *       // ...
 *     />
 *   )
 * }
 *
 * ```
 * */

const GroupChannelFragment = createGroupChannelFragment()

const GroupChannelScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelFragment
      channel={channel}
      onPressMediaMessage={(fileMessage, deleteMessage): void => {
        // Navigate to media viewer
        navigation.navigate(Routes.FileViewer, {
          serializedFileMessage: fileMessage.serialize(),
          deleteMessage,
        })
      }}
      onChannelDeleted={(): void => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList)
      }}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
      onPressHeaderRight={(): void => {
        // Navigate to group channel settings
        navigation.push(Routes.GroupChannelSettings, params)
      }}
    />
  )
}

export default GroupChannelScreen
