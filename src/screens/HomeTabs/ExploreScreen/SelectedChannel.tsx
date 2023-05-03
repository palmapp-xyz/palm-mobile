import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import images from 'assets/images'
import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  Row,
  Tag,
} from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import { UseExploreSearchReturn } from 'hooks/page/explore/useExploreSearch'
import _ from 'lodash'
import React, { ReactElement, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const SelectedChannel = ({
  useExploreSearchReturn,
}: {
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const snapPoints = useMemo(() => ['80%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { selectedChannel, setSelectedChannel } = useExploreSearchReturn

  return (
    <>
      {selectedChannel && (
        <FormBottomSheet
          bottomSheetRef={bottomSheetRef}
          showBottomSheet={!!selectedChannel}
          snapPoints={snapPoints}
          onClose={(): void => setSelectedChannel(undefined)}
          backgroundStyle={{
            backgroundColor: COLOR.black._10,
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.header} />
            <View style={styles.body}>
              <View style={styles.channelImg}>
                <FormImage
                  source={
                    selectedChannel.coverImage
                      ? { uri: selectedChannel.coverImage }
                      : images.palm_logo
                  }
                  size={100}
                />
              </View>
              <View style={styles.section}>
                <FormText fontType="B.16">{selectedChannel.name}</FormText>
              </View>
              <View style={styles.section}>
                <FormText fontType="R.12" color={COLOR.black._200}>
                  {selectedChannel.desc}
                </FormText>
              </View>
              {!!selectedChannel.gating && (
                <View style={styles.section}>
                  <Row style={styles.gatingTokeBox}>
                    <Icon
                      color={COLOR.black._100}
                      size={16}
                      name="alert-circle"
                    />
                    <View>
                      <Row>
                        <FormText color={COLOR.black._500} fontType="B.12">
                          {selectedChannel.gating.amount}
                        </FormText>
                        <FormText color={COLOR.black._500} fontType="R.12">
                          of
                        </FormText>
                      </Row>
                      <Row>
                        {selectedChannel.gating.gatingType === 'Native' ? (
                          <View>
                            <FormText fontType="B.12">
                              {
                                NETWORK.nativeToken[
                                  selectedChannel.gating.chain
                                ]
                              }
                            </FormText>
                          </View>
                        ) : (
                          <View>
                            <FormText fontType="B.12">
                              {UTIL.truncate(
                                selectedChannel.gating.tokenAddress
                              )}
                            </FormText>
                          </View>
                        )}
                        <FormText fontType="R.12"> are required</FormText>
                      </Row>
                    </View>
                  </Row>
                </View>
              )}
              <View style={styles.section}>
                <Row style={{ flexWrap: 'wrap', gap: 4 }}>
                  {_.map(selectedChannel.tags, (item, index) => {
                    return (
                      <Tag key={`selectedChannel.tags-${index}`} title={item} />
                    )
                  })}
                </Row>
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            <FormButton>Join</FormButton>
          </View>
        </FormBottomSheet>
      )}
    </>
  )
}

export default SelectedChannel

const styles = StyleSheet.create({
  header: {
    height: 160,
  },
  channelImg: {
    marginTop: -100,
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  body: { flex: 1, padding: 20, backgroundColor: 'white', gap: 20 },
  section: {},
  gatingTokeBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLOR.black._90010,
    columnGap: 8,
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
})
