import { FormText, Row } from 'components'
import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr } from 'types'

import Clipboard from '@react-native-clipboard/clipboard'
import { useToast } from '@sendbird/uikit-react-native-foundation'

export type ProfileWalletAddressProps = {
  userAddress: ContractAddr | undefined
}

const ProfileWalletAddress = React.memo(
  ({ userAddress }: ProfileWalletAddressProps): ReactElement => {
    const toast = useToast()

    return (
      <View style={styles.walletAddressBox}>
        <FormText fontType="B.14">Wallet Address</FormText>

        <View style={{ rowGap: 8, marginTop: 12 }}>
          <TouchableOpacity
            onPress={(): void => {
              if (!userAddress) {
                return
              }
              toast.show('Address copied', 'success')
              Clipboard.setString(userAddress)
            }}
          >
            <Row
              style={[styles.itemCard, { alignItems: 'center', columnGap: 12 }]}
            >
              <Icon name="wallet" color={COLOR.primary._400} size={20} />
              <FormText fontType="R.14" numberOfLines={1} style={{ flex: 1 }}>
                {userAddress}
              </FormText>
            </Row>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
)

export default ProfileWalletAddress

const styles = StyleSheet.create({
  walletAddressBox: { paddingTop: 24 },
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
})
