import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import { Modal, ModalProps, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FormText from './FormText'

const FormModal = (
  props: ModalProps & {
    title: string
    message: string
    positive: string
    positiveCallback?: () => void
    negative?: string
    negativeCallback?: () => void
  }
): ReactElement => {
  const {
    title,
    message,
    positive,
    negative,
    positiveCallback,
    negativeCallback,
    ...rest
  } = props

  return (
    <Modal {...rest} transparent>
      <View style={styles.container}>
        <View style={styles.body}>
          <FormText
            fontType="B.20"
            color={COLOR.black._900}
            style={{ marginVertical: 16 }}
          >
            {title}
          </FormText>
          <FormText
            fontType="R.14"
            color={COLOR.black._400}
            style={{ marginBottom: 44 }}
          >
            {message}
          </FormText>
          <View style={styles.buttonContainer}>
            {negative && negativeCallback && (
              <View style={{ flex: 2 }}>
                <TouchableOpacity
                  style={styles.negativeButton}
                  onPress={negativeCallback}
                >
                  <FormText fontType="SB.16" color={COLOR.primary._400}>
                    {negative}
                  </FormText>
                </TouchableOpacity>
              </View>
            )}
            {positive && positiveCallback && (
              <View style={{ flex: 3 }}>
                <TouchableOpacity
                  style={styles.positiveButton}
                  onPress={positiveCallback}
                >
                  <FormText fontType="SB.16" color={COLOR.white}>
                    {positive}
                  </FormText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._30}`,
  },
  body: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLOR.white,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  negativeButton: {
    backgroundColor: COLOR.white,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.primary._400,
  },
  positiveButton: {
    backgroundColor: COLOR.primary._400,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
})

export default FormModal
