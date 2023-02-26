import React, { ReactElement } from 'react'
import { StyleSheet, Text, Pressable, FlatList, View } from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { UTIL } from 'consts'

import { Routes } from 'libs/navigation'
import { Card, Container, MoralisNftCard, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import useSetting from 'hooks/independent/useSetting'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user, nftList, balance } = useMyPageMain()
  const { setting } = useSetting()
  return (
    <Container style={styles.container}>
      <View style={{ alignItems: 'flex-end' }}>
        <Pressable
          style={styles.settingIcon}
          onPress={(): void => {
            navigation.navigate(Routes.Setting)
          }}>
          <Icon icon={'settings-filled'} color={'black'} />
        </Pressable>
      </View>
      <Card>
        <Text>{`Network : ${setting.network}`}</Text>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text>Wallet</Text>
            <Text>{UTIL.truncate(user?.address || '')}</Text>
          </View>
          <Text style={{ fontSize: 20 }}>
            {UTIL.formatAmountP(balance)} ETH
          </Text>
        </Row>
      </Card>
      <View
        style={{
          backgroundColor: 'white',
          alignSelf: 'flex-start',
          padding: 5,
          borderRadius: 10,
        }}>
        <Text style={{ fontSize: 20 }}>Owned NFT List</Text>
      </View>
      <FlatList
        data={nftList}
        keyExtractor={(_, index): string => `nftList-${index}`}
        numColumns={2}
        contentContainerStyle={{ gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }): ReactElement => {
          return (
            <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
              <MoralisNftCard item={item} />
            </View>
          )
        }}
      />
    </Container>
  )
}

export default MyPageScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#98CCFF',
    gap: 20,
    height: '100%',
  },
  settingIcon: {},
})
