import { useRecoilValue } from 'recoil'
import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'

import { PostTxStatus } from 'types'
import postTxStore from 'store/postTxStore'
import FormButton, { FormButtonProps } from 'components/atoms/FormButton'
import LinkExplorer from 'components/atoms/LinkExplorer'

const SubmitButton = (props: FormButtonProps): ReactElement => {
  const postTxResult = useRecoilValue(postTxStore.postTxResult)

  return postTxResult.status === PostTxStatus.BROADCAST ? (
    <View>
      <FormButton disabled>Waiting for pending TX</FormButton>
      <LinkExplorer address={postTxResult.transactionHash} type="tx">
        <Text style={{ color: 'blue', paddingLeft: 10 }}>
          Link to pending TX
        </Text>
      </LinkExplorer>
    </View>
  ) : (
    <FormButton {...props} />
  )
}

export default SubmitButton
