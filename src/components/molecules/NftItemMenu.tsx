import { COLOR } from 'consts'
import { isMainnet } from 'libs/utils'
import React, { ReactElement, useState } from 'react'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/Ionicons'
import { Moralis, SupportedNetworkEnum } from 'types'

const NftItemMenu = ({
  chainId,
  item,
  onSelect,
  triggerComponent,
}: {
  chainId?: SupportedNetworkEnum
  item: Moralis.NftItem
  onSelect: (item: Moralis.NftItem, option: string) => Promise<void>
  triggerComponent?: ReactElement
}): ReactElement => {
  const [nftMenuOpen, setNftMenuOpen] = useState<boolean>(false)
  const mainnet = isMainnet()
  const disabled =
    !chainId ||
    (mainnet
      ? chainId !== SupportedNetworkEnum.ETHEREUM &&
        chainId !== SupportedNetworkEnum.POLYGON
      : chainId !== SupportedNetworkEnum.POLYGON)

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
            color={COLOR.black._800}
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
        <MenuOption
          text={`Set as NFT profile ${
            disabled
              ? mainnet
                ? ' (Only Ethereum and Polygon NFTs Supported)'
                : '(Only Mumbai NFTs supported)'
              : ''
          }`}
          value={'set_nft_profile'}
          disabled={disabled}
        />
      </MenuOptions>
    </Menu>
  )
}

export default NftItemMenu
