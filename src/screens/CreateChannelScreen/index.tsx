import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import {
  Container,
  FormImage,
  FormInput,
  FormText,
  Header,
  Row,
  Tag,
} from 'components'

import images from 'assets/images'
import { useAppNavigation } from 'hooks/useAppNavigation'
import TokenGating from './TokenGating'
import useCreateChannel from 'hooks/page/groupChannel/useCreateChannel'

const CreateChannelScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const useCreateChannelReturn = useCreateChannel()
  const {
    fsTags,
    channelImage,
    selectedTagIds,
    setSelectedTagIds,
    channelName,
    setChannelName,
    desc,
    setDesc,
    showTokenGating,
    setShowTokenGating,
    isValidForm,
    onClickGetFile,
    onClickConfirm,
    selectedGatingToken,
    setSelectedGatingToken,
    gatingTokenAmount,
    setGatingTokenAmount,
  } = useCreateChannelReturn

  return (
    <>
      <Container style={styles.container}>
        <Header
          left={
            <Icon name="ios-chevron-back" color={COLOR.black._800} size={28} />
          }
          onPressLeft={navigation.goBack}
          right={
            <Icon
              name="ios-checkmark-circle"
              color={isValidForm ? COLOR.primary._400 : COLOR.black._400}
              size={36}
            />
          }
          onPressRight={isValidForm ? onClickConfirm : undefined}
        />
        <View style={styles.selectImageSection}>
          <TouchableOpacity onPress={onClickGetFile}>
            {channelImage ? (
              <View style={{ borderRadius: 999, overflow: 'hidden' }}>
                <FormImage source={channelImage} size={100} />
              </View>
            ) : (
              <FormImage
                source={images.select_image}
                style={{ height: 100, width: 112 }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Chat Room Name
            </FormText>
            <FormInput value={channelName} onChangeText={setChannelName} />
          </View>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Description
            </FormText>
            <FormInput value={desc} onChangeText={setDesc} />
          </View>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Tags
            </FormText>
            <Row style={{ flexWrap: 'wrap', gap: 8 }}>
              {_.map(fsTags, (tag, id) => {
                const selected = selectedTagIds.includes(id)
                return (
                  <TouchableOpacity
                    key={`fsTags-${id}`}
                    style={{
                      overflow: 'hidden',
                      borderRadius: 10,
                      borderStyle: 'solid',
                      borderWidth: 2,
                      borderColor: selected
                        ? COLOR.primary._400
                        : 'transparent',
                    }}
                    onPress={(): void => {
                      setSelectedTagIds(oriList =>
                        selected
                          ? [...oriList].filter(x => x !== id)
                          : [...oriList, id]
                      )
                    }}>
                    <Tag title={tag} />
                  </TouchableOpacity>
                )
              })}
            </Row>
          </View>
          <View style={styles.infoRow}>
            <FormText fontType="R.12" color={COLOR.black._400}>
              Token Gating
            </FormText>

            {selectedGatingToken ? (
              <View style={{ rowGap: 4 }}>
                <TouchableOpacity
                  style={styles.tokenGatingSelectBox}
                  onPress={(): void => {
                    setSelectedGatingToken(undefined)
                    setGatingTokenAmount('')
                  }}>
                  <View style={{ rowGap: 4, flex: 1 }}>
                    <FormText fontType="R.14">
                      {typeof selectedGatingToken === 'string'
                        ? selectedGatingToken
                        : selectedGatingToken.name}
                    </FormText>
                    <FormText fontType="R.14" color={COLOR.black._200}>
                      {`(minimum: ${UTIL.setComma(gatingTokenAmount)})`}
                    </FormText>
                  </View>
                  <Icon
                    name="ios-close-outline"
                    color={COLOR.black._200}
                    size={24}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editTokenGating}
                  onPress={(): void => {
                    setShowTokenGating(true)
                  }}>
                  <FormText fontType="R.14" color={COLOR.black._200}>
                    Edit Token Gating
                  </FormText>
                  <Icon
                    name="chevron-forward"
                    color={COLOR.black._200}
                    size={14}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.tokenGatingSelectBox}
                onPress={(): void => {
                  setShowTokenGating(true)
                }}>
                <View
                  style={{
                    borderRadius: 14,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: `${COLOR.black._900}${COLOR.opacity._10}`,
                    width: 64,
                    height: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}>
                  <Icon name="add" size={38} color={COLOR.black._100} />
                </View>
                <FormText fontType="R.14" color={COLOR.black._200}>
                  Select a Token or NFT
                </FormText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Container>
      {showTokenGating && (
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <TokenGating useCreateChannelReturn={useCreateChannelReturn} />
        </View>
      )}
    </>
  )
}

export default CreateChannelScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectImageSection: {
    height: 240,
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    rowGap: 20,
    padding: 20,
  },
  infoRow: {
    rowGap: 4,
  },
  tokenGatingSelectBox: {
    flexDirection: 'row',
    width: '100%',
    height: 88,
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    columnGap: 16,
  },
  editTokenGating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.black._100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
})
