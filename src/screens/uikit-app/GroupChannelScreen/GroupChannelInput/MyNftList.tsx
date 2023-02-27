import React, { ReactElement } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import { FormButton, MoralisNftCard, Row } from 'components'
import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'

const MyNftList = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { user } = useAuth()
  const { nftList } = useUserNftList({ userAddress: user?.address })

  return useGcInputReturn.stepAfterSelectNft ? (
    <View style={styles.container}>
      <Row style={styles.header}>
        <TouchableOpacity
          onPress={(): void => {
            useGcInputReturn.setStepAfterSelectNft(undefined)
          }}>
          <Icon icon={'arrow-left'} size={24} />
        </TouchableOpacity>

        <FormButton
          disabled={useGcInputReturn.selectedNftList.length < 1}
          size="sm"
          onPress={useGcInputReturn.onClickNextStep}>
          {useGcInputReturn.stepAfterSelectNft}
        </FormButton>
      </Row>
      <FlatList
        data={nftList}
        keyExtractor={(_, index): string => `nftList-${index}`}
        horizontal
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }): ReactElement => {
          const selected = useGcInputReturn.selectedNftList.includes(item)

          return (
            <TouchableOpacity
              style={{
                height: 100,
                width: 100,
                borderColor: selected ? 'blue' : 'gray',
                borderWidth: selected ? 1 : 0,
                borderRadius: 20,
                padding: 10,
                paddingBottom: 30,
              }}
              onPress={(): void => {
                if (useGcInputReturn.stepAfterSelectNft === 'share') {
                  useGcInputReturn.setSelectedNftList(valOrUpdater =>
                    selected
                      ? valOrUpdater.filter(x => x !== item)
                      : [...valOrUpdater, item]
                  )
                } else {
                  useGcInputReturn.setSelectedNftList([item])
                }
              }}>
              <MoralisNftCard
                item={item}
                width={80}
                height={80}
                hideAlt={true}
              />
            </TouchableOpacity>
          )
        }}
      />
    </View>
  ) : (
    <></>
  )
}

export default MyNftList

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F4F6F9',
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
})
