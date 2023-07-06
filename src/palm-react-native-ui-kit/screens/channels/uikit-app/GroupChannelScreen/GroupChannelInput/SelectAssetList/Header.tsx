import { COLOR } from 'palm-core/consts'
import { SupportedNetworkEnum } from 'palm-core/types'
import { Row, SupportedNetworkRow } from 'palm-react-native-ui-kit/components'
import { UseGcInputReturn } from 'palm-react/hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

const Header = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { selectedNetwork, onChangeNetwork } = useGcInputReturn

  return (
    <>
      <Row style={styles.inputHeader}>
        <TouchableOpacity
          onPress={(): void => {
            useGcInputReturn.onPressClose()
            onChangeNetwork(SupportedNetworkEnum.ETHEREUM)
          }}
        >
          <Icon color={COLOR.primary._400} name={'close-outline'} size={36} />
        </TouchableOpacity>
      </Row>
      <View style={{ paddingHorizontal: 16, rowGap: 8 }}>
        <SupportedNetworkRow
          selectedNetwork={selectedNetwork}
          onNetworkSelected={onChangeNetwork}
        />
      </View>
    </>
  )
}

export default Header

const styles = StyleSheet.create({
  inputHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
    marginTop: 10,
  },
  nextStepIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
})
