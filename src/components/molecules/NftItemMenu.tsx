import { COLOR } from 'consts'
import React, { ReactElement, useState } from 'react'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/Ionicons'
import { Moralis } from 'types'

const NftItemMenu = ({
  item,
  onSelect,
  triggerComponent,
}: {
  item: Moralis.NftItem
  onSelect: (item: Moralis.NftItem, option: string) => Promise<void>
  triggerComponent?: ReactElement
}): ReactElement => {
  const [nftMenuOpen, setNftMenuOpen] = useState<boolean>(false)

  return (
    <Menu
      opened={nftMenuOpen}
      onBackdropPress={(): void => setNftMenuOpen(false)}
      onSelect={(selected: string): void => {
        setNftMenuOpen(false)
        onSelect(item, selected)
      }}>
      <MenuTrigger onPress={(): void => setNftMenuOpen(!nftMenuOpen)}>
        {triggerComponent || (
          <Icon
            name="reorder-three-outline"
            color={COLOR.gray._800}
            size={20}
          />
        )}
      </MenuTrigger>
      <MenuOptions
        customStyles={{ optionsWrapper: { alignItems: 'center' } }}
        optionsContainerStyle={{
          marginTop: -100,
          marginStart: 16,
          maxWidth: 150,
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}>
        <MenuOption text="Set as NFT profile" value={'set_nft_profile'} />
      </MenuOptions>
    </Menu>
  )
}

export default NftItemMenu
