import React, { ReactElement } from 'react'
import { Modal, ModalProps, SafeAreaView } from 'react-native'

const FormModal = (props: ModalProps): ReactElement => {
  const { children, ...rest } = props

  return (
    <Modal {...rest}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        {children}
      </SafeAreaView>
    </Modal>
  )
}

export default FormModal
