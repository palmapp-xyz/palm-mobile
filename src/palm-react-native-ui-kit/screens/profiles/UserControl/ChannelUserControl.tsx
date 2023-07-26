import { BottomSheetView } from '@gorhom/bottom-sheet'
import { FormBottomSheet } from 'palm-react-native-ui-kit/components'
import React, { ReactElement, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ConfirmUserControl from './ConfirmUserControl'
import UserControlMenu from './UserControlMenu'

const ChannelUserControl = ({
  showChannelUserControl,
  setShowChannelUserControl,
  profileId,
  channelUrl,
}: {
  showChannelUserControl: boolean
  setShowChannelUserControl: React.Dispatch<React.SetStateAction<boolean>>
  profileId: string
  channelUrl: string
}): ReactElement => {
  const [selected, setSelected] = useState<'ban' | 'mute' | undefined>(
    undefined
  )

  const snapPoints = selected ? ['60%'] : ['30%']

  const { bottom } = useSafeAreaInsets()

  return (
    <FormBottomSheet
      showBottomSheet={showChannelUserControl}
      snapPoints={snapPoints}
      onClose={(): void => {
        setSelected(undefined)
        setShowChannelUserControl(false)
      }}
    >
      <BottomSheetView
        style={[
          styles.bottomSheetContainer,
          { marginBottom: Platform.select({ ios: bottom + 20 }) },
        ]}
      >
        {selected === undefined ? (
          <UserControlMenu
            setSelected={setSelected}
            setShowChannelUserControl={setShowChannelUserControl}
          />
        ) : (
          <ConfirmUserControl
            profileId={profileId}
            channelUrl={channelUrl}
            controlType={selected}
            setShowChannelUserControl={setShowChannelUserControl}
          />
        )}
      </BottomSheetView>
    </FormBottomSheet>
  )
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})

export default ChannelUserControl
