import FormButton, { FormButtonProps } from 'components/atoms/FormButton'
import LinkExplorer from 'components/atoms/LinkExplorer'
import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useRecoilValue } from 'recoil'
import postTxStore from 'store/postTxStore'
import { PostTxStatus, SupportedNetworkEnum } from 'types'

const SubmitButton = ({
  network,
  ...props
}: FormButtonProps & { network: SupportedNetworkEnum }): ReactElement => {
  const postTxResult = useRecoilValue(postTxStore.postTxResult)

  return postTxResult.status === PostTxStatus.BROADCAST ? (
    <View>
      <FormButton disabled>Waiting for pending TX</FormButton>
      <LinkExplorer
        address={postTxResult.transactionHash}
        type="tx"
        network={network}>
        <Text style={{ color: COLOR.primary._400, paddingLeft: 10 }}>
          Link to pending TX
        </Text>
      </LinkExplorer>
    </View>
  ) : (
    <FormButton {...props} />
  )
}

export default SubmitButton
