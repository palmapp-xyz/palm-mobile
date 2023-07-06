import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { PostTxStatus } from 'palm-core/types'
import {
  Card,
  FormImage,
  LinkExplorer,
} from 'palm-react-native-ui-kit/components'
import postTxStore from 'palm-react/store/postTxStore'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components/native'

import { Icon } from '@sendbird/uikit-react-native-foundation'

const StyledTextBox = styled(View)`
  align-items: center;
  margin-bottom: 10px;
`

const StatusText = ({ children }: { children: string }): ReactElement => {
  return <Text>{children}</Text>
}

const TxStatusMini = ({
  onPressClose,
  setMinimized,
}: {
  onPressClose: () => void
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const { t } = useTranslation()
  const postTxResult = useRecoilValue(postTxStore.postTxResult)

  return (
    <Pressable
      style={styles.container}
      onPress={(): void => {
        setMinimized(false)
      }}
    >
      {[PostTxStatus.POST, PostTxStatus.BROADCAST].includes(
        postTxResult.status
      ) === false && (
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={(e): void => {
            onPressClose()
            e.stopPropagation()
          }}
        >
          <Icon icon="close" size={20} />
        </TouchableOpacity>
      )}
      <Card borderRound={true} style={styles.card}>
        {postTxResult.status === PostTxStatus.POST && (
          <>
            <View style={styles.iconBox}>
              <FormImage source={images.loading} size={30} />
            </View>
            <StyledTextBox>
              <StatusText>{t('Navigation.TxStatusMini.Posting')}</StatusText>
            </StyledTextBox>
          </>
        )}

        {postTxResult.status === PostTxStatus.BROADCAST && (
          <>
            <View style={styles.iconBox}>
              <FormImage source={images.loading} size={30} />
            </View>
            <StyledTextBox>
              <StatusText>{t('Navigation.TxStatusMini.PendingTx')}</StatusText>
              <LinkExplorer
                type="tx"
                address={postTxResult.transactionHash}
                network={postTxResult.chain}
              >
                <Text style={{ color: COLOR.primary._400 }}>
                  {UTIL.truncate(postTxResult.transactionHash, [4, 4])}
                </Text>
              </LinkExplorer>
            </StyledTextBox>
          </>
        )}

        {postTxResult.status === PostTxStatus.DONE && (
          <>
            <View style={styles.iconBox}>
              <Icon icon="done" size={30} color="green" />
            </View>
            {postTxResult.value ? (
              <StyledTextBox>
                <LinkExplorer
                  type="tx"
                  address={postTxResult.value.transactionHash}
                  network={postTxResult.chain}
                >
                  <Text style={{ color: COLOR.primary._400 }}>
                    {UTIL.truncate(postTxResult.value.transactionHash, [4, 4])}
                  </Text>
                </LinkExplorer>
              </StyledTextBox>
            ) : (
              <Text>{t('Common.Done')}</Text>
            )}
          </>
        )}

        {postTxResult.status === PostTxStatus.ERROR && (
          <>
            <View style={styles.iconBox}>
              <Icon icon="error" size={30} color="red" />
            </View>
            <StyledTextBox>
              <StatusText>{t('Navigation.TxStatusMini.TxFailed')}</StatusText>
            </StyledTextBox>
          </>
        )}
      </Card>
    </Pressable>
  )
}

export default TxStatusMini

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    right: 0,
    zIndex: 1,
    cursor: 'zoom-in',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  card: {
    minWidth: 100,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 16,
    paddingBottom: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: COLOR.primary._100,
    borderWidth: 2,
    borderColor: COLOR.primary._300,
    borderRightWidth: 0,
  },
  iconBox: {
    alignItems: 'center',
  },
})
