import React, { ReactElement, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import { FormButton, MoralisNftRenderer, Row } from 'components'
import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'
import { COLOR } from 'consts'
import { SupportedNetworkEnum } from 'types'
import SupportedNetworkRow from 'components/molecules/SupportedNetworkRow'

const MyNftList = ({
  useGcInputReturn,
}: {
  useGcInputReturn: UseGcInputReturn
}): ReactElement => {
  const { user } = useAuth()
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkEnum>(
    SupportedNetworkEnum.ETHEREUM
  )

  const { nftList } = useUserNftList({
    userAddress: user?.address,
    selectedNetwork,
  })

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
      <SupportedNetworkRow
        selectedNetwork={selectedNetwork}
        onNetworkSelected={setSelectedNetwork}
      />
      {nftList.length === 0 && (
        <View style={styles.footer}>
          <Text style={styles.text}>{'The user has no NFTs yet.'}</Text>
        </View>
      )}
      <FlatList
        data={nftList}
        keyExtractor={(_, index): string => `nftList-${index}`}
        horizontal
        style={{ paddingHorizontal: 10 }}
        contentContainerStyle={{
          gap: 10,
          paddingTop: 10,
        }}
        renderItem={({ item }): ReactElement => {
          const selected = useGcInputReturn.selectedNftList.includes(item)

          return (
            <TouchableOpacity
              style={{
                borderColor: selected ? COLOR.primary._400 : COLOR.primary._100,
                borderWidth: 1,
                borderRadius: 10,
                height: 150,
                overflow: 'hidden',
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
              <View style={{ padding: 5 }}>
                <MoralisNftRenderer
                  item={item}
                  width={150}
                  height="100%"
                  hideAlt={true}
                />
              </View>
              <View style={styles.nftTitle}>
                <Text style={{ fontSize: 10 }}>{`#${item.token_id}`}</Text>
              </View>
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
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 10,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
