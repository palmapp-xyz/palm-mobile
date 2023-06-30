import { FormText, Row } from 'components'
import { COLOR } from 'core/consts'
import { ContractAddr } from 'core/types'
import useToast from 'hooks/useToast'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import Clipboard from '@react-native-clipboard/clipboard'

export type ProfileWalletAddressProps = {
  userAddress: ContractAddr | undefined
}

const ProfileWalletAddress = React.memo(
  ({ userAddress }: ProfileWalletAddressProps): ReactElement => {
    const toast = useToast()
    const { t } = useTranslation()

    return (
      <View style={styles.walletAddressBox}>
        <FormText font={'B'}>
          {t('Components.ProfileWalletAddress.WalletAddress')}
        </FormText>

        <View style={{ rowGap: 8, marginTop: 12 }}>
          <TouchableOpacity
            onPress={(): void => {
              if (!userAddress) {
                return
              }
              toast.show(t('Components.ProfileWalletAddress.AddressCopied'), {
                color: 'green',
                icon: 'check',
              })
              Clipboard.setString(userAddress)
            }}
          >
            <Row
              style={[styles.itemCard, { alignItems: 'center', columnGap: 12 }]}
            >
              <Icon name="wallet" color={COLOR.primary._400} size={20} />
              <FormText
                numberOfLines={1}
                ellipsizeMode="middle"
                style={{ flex: 1 }}
              >
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
