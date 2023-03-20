import type { UIKitPalette } from '@sendbird/uikit-react-native-foundation'
import { NETWORK } from 'consts'
import { URL } from 'react-native-url-polyfill'
import {
  ChainNetworkEnum,
  NetworkSettingEnum,
  SupportedNetworkEnum,
} from 'types'

export const getContrastColor = (
  color:
    | 'transparent'
    | `#${string}`
    | `rgba(${number},${number},${number},${number})`
    | `rgb(${number},${number},${number})`
): 'black' | 'gray' | 'white' => {
  if (color.startsWith('rgb')) {
    const [r, g, b, a] = color
      .replace(/rgba?|\(|\)/g, '')
      .split(',')
      .map(c => Number(c ?? 0))
    if (a < 0.2) {
      return 'gray'
    }
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? 'black' : 'white'
  }

  if (color.startsWith('#')) {
    const [r1, r2, g1, g2, b1, b2] = color.replace('#', '')
    const convHex = (hex1: string, hex2: string): number =>
      parseInt(hex1 + hex2, 16)
    return (convHex(r1, r2) * 299 +
      convHex(g1, g2) * 587 +
      convHex(b1, b2) * 114) /
      1000 >
      125
      ? 'black'
      : 'white'
  }

  if (color === 'transparent') {
    return 'gray'
  }
  throw new Error('invalid color format:' + color)
}

export const findColorNameFromPalette = (
  palette: UIKitPalette,
  targetHex: string
): string => {
  const map = Object.entries(palette)
  const color = map.find(([, hex]) => hex === targetHex)
  if (!color) {
    return 'NOT_FOUND'
  }
  return color[0]
}

export const isValidHttpUrl = (src: string | undefined): boolean => {
  if (!src) {
    return false
  }

  let url
  try {
    url = new URL(src)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const replaceAll = (
  str: string,
  search: string,
  replace: string
): string => {
  const searchRegExp = new RegExp(search, 'g')
  return str.replace(searchRegExp, replace)
}

export const unescape = (src: string): string => {
  return replaceAll(
    replaceAll(
      replaceAll(
        replaceAll(
          replaceAll(replaceAll(src, '%23', '#'), '%2b', '+'),
          '%3c',
          '<'
        ),
        '%3e',
        '>'
      ),
      '%2c',
      ','
    ),
    '%3b',
    ';'
  )
}

export const formatHex = (str: string): string => {
  let ret = str.trim()
  if (!ret.startsWith('0x')) {
    ret = `0x${ret}`
  }
  return ret
}

export const isMainnet = (
  chain: ChainNetworkEnum | string | number | NetworkSettingEnum
): boolean => {
  return (
    chain === NetworkSettingEnum.MAINNET ||
    chain === ChainNetworkEnum.ETHEREUM ||
    chain === ChainNetworkEnum.POLYGON ||
    chain === ChainNetworkEnum.CYPRESS ||
    Number(chain) === NETWORK.chainId.ETHEREUM ||
    Number(chain) === NETWORK.chainId.POLYGON ||
    Number(chain) === NETWORK.chainId.CYPRESS
  )
}

export const chainIdToSupportedNetworkEnum = (
  chain: string
): SupportedNetworkEnum | undefined => {
  return Number(chain) === NETWORK.chainId[ChainNetworkEnum.ETHEREUM] ||
    Number(chain) === NETWORK.chainId[ChainNetworkEnum.GOERLI]
    ? SupportedNetworkEnum.ETHEREUM
    : Number(chain) === NETWORK.chainId[ChainNetworkEnum.CYPRESS] ||
      Number(chain) === NETWORK.chainId[ChainNetworkEnum.BAOBAB]
    ? SupportedNetworkEnum.KLAYTN
    : Number(chain) === NETWORK.chainId[ChainNetworkEnum.POLYGON] ||
      Number(chain) === NETWORK.chainId[ChainNetworkEnum.MUMBAI]
    ? SupportedNetworkEnum.POLYGON
    : undefined
}
