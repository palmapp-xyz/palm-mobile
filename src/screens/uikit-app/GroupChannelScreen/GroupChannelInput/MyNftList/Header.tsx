import { Row, SupportedNetworkRow } from 'components'
import { COLOR } from 'consts'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { SupportedNetworkEnum } from 'types'

const Header = ({
  useGcInputReturn,
  selectedNetwork,
  onChangeNetwork,
}: {
  useGcInputReturn: UseGcInputReturn
  selectedNetwork: SupportedNetworkEnum
  onChangeNetwork: (value: SupportedNetworkEnum) => void
}): ReactElement => {
  const disabledNext = useGcInputReturn.selectedNftList.length < 1

  return (
    <>
      <Row style={styles.inputHeader}>
        <TouchableOpacity
          onPress={(): void => {
            useGcInputReturn.setOpenBottomMenu(false)
            useGcInputReturn.setStepAfterSelectNft(undefined)
            onChangeNetwork(SupportedNetworkEnum.ETHEREUM)
          }}
        >
          <Icon color={COLOR.primary._400} name={'close-outline'} size={36} />
        </TouchableOpacity>
        {useGcInputReturn.runningNextStep ? (
          <View style={styles.nextStepIcon}>
            <ActivityIndicator size="large" color={COLOR.primary._400} />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextStepIcon,
              {
                backgroundColor: disabledNext
                  ? COLOR.black._50
                  : COLOR.primary._400,
              },
            ]}
            disabled={disabledNext}
            onPress={(): void => {
              useGcInputReturn.onClickNextStep()
              onChangeNetwork(SupportedNetworkEnum.ETHEREUM)
            }}
          >
            <Icon name="arrow-up" color={'white'} size={24} />
          </TouchableOpacity>
        )}
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
