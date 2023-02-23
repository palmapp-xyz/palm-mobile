import React, { ReactElement } from 'react'
import { SafeAreaView, Modal, ModalProps } from 'react-native'

const FormModal = (props: ModalProps): ReactElement => {
  const { children, ...rest } = props

  return (
    <Modal {...rest}>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </Modal>
  )
}

export default FormModal
