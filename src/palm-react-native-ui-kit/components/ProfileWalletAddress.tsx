import { COLOR } from 'palm-core/consts'
import { ContractAddr } from 'palm-core/types'
import { FormText, Row } from 'palm-react-native-ui-kit/components'
import useToast from 'palm-react-native/app/useToast'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import Clipboard from '@react-native-clipboard/clipboard'
import { UTIL } from 'palm-core/libs'

export type ProfileWalletAddressProps = {
  userAddress: ContractAddr | undefined
}

const ProfileWalletAddress = React.memo(
  ({ userAddress }: ProfileWalletAddressProps): ReactElement => {
    const toast = useToast()
    const { t } = useTranslation()

    return (
      <View style={styles.walletAddressBox}>
        {userAddress && (
          <>
            <FormText font={'B'}>
              {t('Components.ProfileWalletAddress.WalletAddress')}
            </FormText>

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
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <FormText color={COLOR.black._500}>
                  {UTIL.truncate(userAddress.toString(), [6, 4])}
                </FormText>
                <Icon name="copy-outline" color={COLOR.black._500} size={14} />
              </Row>
            </TouchableOpacity>
          </>
        )}
      </View>
    )
  }
)

export default ProfileWalletAddress

const styles = StyleSheet.create({
  walletAddressBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingBottom: 24,
  },
})
