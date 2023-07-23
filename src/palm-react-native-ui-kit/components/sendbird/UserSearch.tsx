import { COLOR } from 'palm-core/consts'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FormInput from '../atoms/FormInput'

const UserSearch = ({
  input,
  setInput,
}: {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}): ReactElement => {
  const { t } = useTranslation()

  return (
    <View style={{ marginHorizontal: 20 }}>
      <FormInput
        placeholder={t('Channels.ChannelInviteSearchPlaceholder')}
        maxLength={20}
        value={input}
        onChangeText={setInput}
        returnKeyType="search"
        style={{ marginVertical: 12 }}
      />
      {input.length > 0 && (
        <View style={styles.clear}>
          <TouchableOpacity
            onPress={(): void => {
              setInput('')
            }}
          >
            <Ionicon name="close-outline" size={20} color={COLOR.black._300} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  clear: {
    position: 'absolute',
    right: 10,
    top: 22,
    justifyContent: 'center',
    zIndex: 1,
  },
})

export default UserSearch
