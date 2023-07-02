import images from 'assets/images'
import { FormButton, FormImage, FormText, MediaRenderer, Row } from 'components'
import NftCard from 'components/channel/NftCard'
import { getFsProfile } from 'palm-core/libs/firebase'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { FbProfile, Moralis } from 'palm-core/types'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAsyncEffect } from '@sendbird/uikit-utils'

const Contents = ({
  selectedNft,
  receiverId,
  setShowBottomSheet,
}: {
  selectedNft: Moralis.NftItem
  receiverId: string
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const { t } = useTranslation()
  const [receiver, setReceiver] = useState<FbProfile>()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)

  useAsyncEffect(async () => {
    const _receiver = await getFsProfile(receiverId)
    setReceiver(_receiver)
  }, [receiverId])

  return (
    <View style={styles.body}>
      <View>
        <View style={{ rowGap: 8, paddingBottom: 28 }}>
          <FormText font={'SB'}>{t('Nft.SendNftWantToSendThisNft')}</FormText>
          <Row style={{ columnGap: 8 }}>
            {receiverProfileImg ? (
              <MediaRenderer
                src={receiverProfileImg}
                width={32}
                height={32}
                style={{ borderRadius: 50 }}
              />
            ) : (
              <FormImage
                source={images.profile_temp}
                size={32}
                style={{ borderRadius: 50 }}
              />
            )}
            <FormText font={'B'} size={24}>
              {receiver?.handle}
            </FormText>
          </Row>
        </View>
        <NftCard selectedNft={selectedNft} />
      </View>
      <FormButton
        onPress={(): void => {
          setShowBottomSheet(true)
        }}
      >
        {t('Nft.SendNftSend')}
      </FormButton>
    </View>
  )
}

export default Contents

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
