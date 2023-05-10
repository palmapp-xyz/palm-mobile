import { FormButton, FormImage, FormText, MediaRenderer, Row } from 'components'
import useFsProfile from 'hooks/firestore/useFsProfile'
import React, { ReactElement, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FbProfile, Moralis } from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'
import images from 'assets/images'
import NftCard from 'components/channel/NftCard'
import { getProfileMediaImg } from 'libs/lens'

const Contents = ({
  selectedNft,
  receiverId,
  setShowBottomSheet,
}: {
  selectedNft: Moralis.NftItem
  receiverId: string
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const [receiver, setReceiver] = useState<FbProfile>()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)

  const { fetchProfile } = useFsProfile({})
  useAsyncEffect(async () => {
    const _receiver = await fetchProfile(receiverId)
    setReceiver(_receiver)
  }, [receiverId])

  return (
    <View style={styles.body}>
      <View>
        <View style={{ rowGap: 8, paddingBottom: 28 }}>
          <FormText fontType="SB.14">I want to send this NFT to</FormText>
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
            <FormText fontType="B.24">{receiver?.handle}</FormText>
          </Row>
        </View>
        <NftCard selectedNft={selectedNft} />
      </View>
      <FormButton
        onPress={(): void => {
          setShowBottomSheet(true)
        }}
      >
        Send
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
