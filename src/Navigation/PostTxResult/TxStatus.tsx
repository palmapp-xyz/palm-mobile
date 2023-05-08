import images from 'assets/images'
import { Card, FormButton, FormImage, LinkExplorer } from 'components'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import postTxStore from 'store/postTxStore'
import styled from 'styled-components'
import { PostTxStatus, SupportedNetworkEnum } from 'types'

import { Icon } from '@sendbird/uikit-react-native-foundation'

const StyledContainer = styled(View)`
  position: absolute;
  width: 100%;
  background-color: #00000099;
  top: 0;
  height: 100%;
  z-index: 1;
`

const StyledCard = styled(Card)`
  width: 480px;
  max-width: 100%;
  position: relative;
  margin: auto;
  margin-bottom: 0;
  padding-bottom: 50px;
  padding: 24px;
  border-radius: 15px;
`

const StyledTextBox = styled(View)`
  align-items: center;
  margin-bottom: 10px;
`

const StatusText = ({ children }: { children: string }): ReactElement => {
  return <Text>{children}</Text>
}

const TxStatus = ({
  onPressClose,
  setMinimized,
  network,
}: {
  onPressClose: () => void
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>
  network: SupportedNetworkEnum
}): ReactElement => {
  const postTxResult = useRecoilValue(postTxStore.postTxResult)
  return (
    <StyledContainer>
      <StyledCard>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={(): void => {
            setMinimized(true)
          }}
        >
          <Icon icon="ban" size={20} />
        </TouchableOpacity>
        <View>
          {postTxResult.status === PostTxStatus.POST && (
            <>
              <View style={styles.iconBox}>
                <FormImage source={images.loading} size={60} />
              </View>
              <StyledTextBox>
                <StatusText>Posting...</StatusText>
              </StyledTextBox>
            </>
          )}

          {postTxResult.status === PostTxStatus.BROADCAST && (
            <>
              <View style={styles.iconBox}>
                <FormImage source={images.loading} size={60} />
              </View>
              <StyledTextBox>
                <StatusText>Pending transaction</StatusText>
                <LinkExplorer
                  type="tx"
                  address={postTxResult.transactionHash}
                  network={network}
                />
              </StyledTextBox>
            </>
          )}
          {postTxResult.status === PostTxStatus.DONE && (
            <>
              <View style={styles.iconBox}>
                <Icon icon="done" size={60} color="green" />
              </View>
              {postTxResult.value && (
                <StyledTextBox>
                  <LinkExplorer
                    type="tx"
                    address={postTxResult.value.transactionHash}
                    network={network}
                  />
                </StyledTextBox>
              )}
              <FormButton onPress={onPressClose}>Success</FormButton>
            </>
          )}

          {postTxResult.status === PostTxStatus.ERROR && (
            <>
              <View style={styles.iconBox}>
                <Icon icon="error" size={60} color="red" />
              </View>
              <StyledTextBox>
                <StatusText>Tx Error</StatusText>
              </StyledTextBox>
              <ScrollView
                style={{
                  maxHeight: 300,
                  backgroundColor: '#eeeeee',
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text>{_.toString(postTxResult.error)}</Text>
              </ScrollView>
              <FormButton onPress={onPressClose}>Close</FormButton>
            </>
          )}
        </View>
      </StyledCard>
    </StyledContainer>
  )
}

export default TxStatus

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
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
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingBottom: 10,
    borderRadius: 20,
  },
  iconBox: {
    alignItems: 'center',
    paddingBottom: 10,
  },
})
