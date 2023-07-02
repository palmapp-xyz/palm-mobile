import { Container, FormButton, FormText, Header, Row } from 'components'
import Loading from 'components/atoms/Loading'
import useConfirmSeed from 'hooks/page/account/useConfirmSeed'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import appStore from 'palm-react/store/appStore'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useRecoilState } from 'recoil'

const ConfirmSeedScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ConfirmSeed>()
  const mnemonic = params.mnemonic
  const {
    wordList,
    hintList,
    emptyFistIndex,
    onClickConfirm,
    isValidForm,
    selectedWordList,
    setSelectedWordList,
  } = useConfirmSeed({ mnemonic })
  const { t } = useTranslation()

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const onPressConfirm = async (): Promise<void> => {
    navigation.push(Routes.Pin, {
      type: 'set',
      result: async (result: boolean): Promise<void> => {
        if (result === true) {
          setLoading(true)
          setTimeout(async () => {
            await onClickConfirm()
            setLoading(false)
            navigation.replace(Routes.CreateComplete)
          }, 100)
        }

        return Promise.resolve()
      },
      cancel: () => {
        navigation.pop()
      },
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText font={'B'} size={24} style={{ fontWeight: 'bold' }}>
            {t('Auth.ConfirmSeed')}
          </FormText>
          <FormText color={COLOR.black._400}>
            {t('Auth.ConfirmSeedMessage')}
          </FormText>
        </View>
        <View style={{ rowGap: 20 }}>
          <FlatList
            data={wordList}
            numColumns={2}
            columnWrapperStyle={{ columnGap: 24 }}
            contentContainerStyle={{ rowGap: 12 }}
            keyExtractor={(item, index): string => `wordList-input-${index}`}
            renderItem={({ item, index }): ReactElement => {
              const targetWord = selectedWordList[index]
              return (
                <Row style={styles.seedItem}>
                  <FormText style={{ width: 20 }}>{item.index + 1}</FormText>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      borderColor:
                        emptyFistIndex === index
                          ? COLOR.primary._400
                          : COLOR.black._200,
                      borderWidth: 1,
                      borderStyle: 'solid',
                      paddingVertical: 9,
                      paddingHorizontal: 12,
                    }}
                    onPress={(): void => {
                      setSelectedWordList(oriList => {
                        const newList = [...oriList]
                        newList[newList.findIndex(x => x === targetWord)] = ''
                        return newList
                      })
                    }}
                  >
                    <FormText>{targetWord || ' '}</FormText>
                  </TouchableOpacity>
                </Row>
              )
            }}
          />
          <FlatList
            data={hintList.filter(x => !selectedWordList.includes(x.word))}
            numColumns={2}
            style={{ columnGap: 14 }}
            contentContainerStyle={{ rowGap: 12 }}
            keyExtractor={(item, index): string => `wordList-${index}`}
            renderItem={({ item }): ReactElement => {
              return (
                <View style={{ flex: 1 / 2, marginHorizontal: 6 }}>
                  <FormButton
                    figure="outline"
                    onPress={(): void => {
                      setSelectedWordList(oriList => {
                        const newList = [...oriList]
                        newList[emptyFistIndex] = item.word
                        return newList
                      })
                    }}
                  >
                    {item.word}
                  </FormButton>
                </View>
              )
            }}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <FormButton
          size="lg"
          disabled={!isValidForm || loading}
          onPress={onPressConfirm}
        >
          Next
        </FormButton>
      </View>
    </Container>
  )
}

export default ConfirmSeedScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingVertical: 12 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  seedItem: {
    flex: 1,
    columnGap: 4,
    alignItems: 'center',
  },
})
