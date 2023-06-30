import type { UIKitPalette } from '@sendbird/uikit-react-native-foundation'
import images from 'assets/images'
import BigNumber from 'bignumber.js'
import Config from 'config'
import { NETWORK } from 'core/consts'
import {
  ChainNetworkEnum,
  ContractAddr,
  JwtToken,
  Moralis,
  NetworkTypeEnum,
  pToken,
  SupportedNetworkEnum,
  Token,
  uToken,
} from 'core/types'
import _ from 'lodash'

const getContrastColor = (
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

const findColorNameFromPalette = (
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

const replaceAll = (str: string, search: string, replace: string): string => {
  const searchRegExp = new RegExp(search, 'g')
  return str.replace(searchRegExp, replace)
}

const unescape = (src: string): string => {
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

const formatHex = (str: string): string => {
  let ret = str.trim()
  if (!ret.startsWith('0x')) {
    ret = `0x${ret}`
  }
  return ret
}

const isMainnet = (): boolean => {
  return Config.ENV_NAME === NetworkTypeEnum.MAINNET
}

const chainIdToSupportedNetworkEnum = (
  chain: string | number
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

const compareContractAddr = (
  a: string | ContractAddr,
  b: string | ContractAddr
): boolean => {
  if (a.length !== b.length) {
    return false
  }
  a = a.toLowerCase()
  b = b.toLowerCase()
  for (let i = 0; i < a.length; i++) {
    if (a.charAt(i) !== b.charAt(i)) {
      return false
    }
  }

  return true
}

const parseJwt = (token: string): JwtToken | undefined => {
  return jsonTryParse<JwtToken>(
    Buffer.from(token.split('.')[1], 'base64').toString()
  )
}

const filterUndefined = <T>(object: T): T => {
  if (!object) {
    return object
  }
  return _.omit(
    object,
    _.filter(_.keys(object), function (key) {
      return _.isUndefined(object[key])
    })
  ) as T
}

const getTokenBalanceInUSD = (
  amount: string,
  price: Moralis.TokenPrice | null | undefined
): pToken | undefined => {
  if (!price) {
    return undefined
  }

  return toBn(amount as pToken)
    .multipliedBy(price.usdPrice)
    .toString(10) as pToken
}

const getNetworkLogo = (chain: SupportedNetworkEnum): any => {
  return chain === SupportedNetworkEnum.POLYGON
    ? images.matic_logo
    : chain === SupportedNetworkEnum.KLAYTN
    ? images.klay_logo
    : images.eth_logo
}

const P_DECIMAL = 1e18
const U_DECIMAL = 1e6

const truncate = (text: string, [h, t]: number[] = [5, 5]): string => {
  const head = text.slice(0, h)
  const tail = text.slice(-1 * t, text.length)
  return text.length > h + t ? [head, tail].join('...') : text
}

const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

const setComma = (str: string | number): string => {
  const parts = _.toString(str).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const delComma = (str: string): string => {
  return _.toString(str).replace(/,/g, '')
}

const extractNumber = (str: string): string => str.replace(/\D+/g, '')

const isNumberString = (value: number | string): boolean =>
  new BigNumber(value || '').isNaN() === false

const toBn = (value?: number | string): BigNumber => new BigNumber(value || 0)

const isEven = (value: number): boolean => value % 2 === 0

const isOdd = (value: number): boolean => !isEven(value)

const microfyU2P = (value: uToken): pToken =>
  toBn(value).multipliedBy(P_DECIMAL).div(U_DECIMAL).toString(10) as pToken

const microfyU = (value: Token): uToken =>
  toBn(value).multipliedBy(U_DECIMAL).toString(10) as uToken

const microfyP = (value: Token): pToken =>
  toBn(value).multipliedBy(P_DECIMAL).toString(10) as pToken

const demicrofyU = (value: uToken): Token =>
  toBn(value).div(U_DECIMAL).toString(10) as Token

const demicrofyP = (value: pToken): Token =>
  toBn(value).div(P_DECIMAL).toString(10) as Token

const formatAmountU = (
  value: uToken,
  option?: {
    abbreviate?: boolean
    toFix?: number
  }
): string => formatAmountP(microfyP(demicrofyU(value)), option)

const eraseDecimal = (value: string): string => toBn(value).toString(10)

const formatAmountP = (
  value: pToken,
  option?: {
    abbreviate?: boolean
    toFix?: number
  }
): string => {
  const demicrofyValue = toBn(demicrofyP(value))
  const strValue =
    option?.toFix !== undefined
      ? eraseDecimal(
          demicrofyValue.toFixed(option?.toFix, BigNumber.ROUND_DOWN)
        )
      : demicrofyValue.toString(10)

  if (option?.abbreviate) {
    const abbreviated = abbreviateNumber(strValue, { toFix: option?.toFix })
    return `${setComma(abbreviated.value)}${abbreviated.unit}`
  }
  return setComma(strValue)
}

const abbreviateNumber = (
  value: string,
  option?: {
    toFix?: number
  }
): { value: string; unit: string } => {
  const toFix = option?.toFix || 2
  const bn = toBn(value)

  if (bn.gte(1e12)) {
    return {
      value: eraseDecimal(bn.div(1e12).toFixed(toFix, BigNumber.ROUND_DOWN)),
      unit: 'T',
    }
  } else if (bn.gte(1e9)) {
    return {
      value: eraseDecimal(bn.div(1e9).toFixed(toFix, BigNumber.ROUND_DOWN)),
      unit: 'B',
    }
  } else if (bn.gte(1e6)) {
    return {
      value: eraseDecimal(bn.div(1e6).toFixed(toFix, BigNumber.ROUND_DOWN)),
      unit: 'M',
    }
  } else if (bn.gte(1e3)) {
    return {
      value: eraseDecimal(bn.div(1e3).toFixed(toFix, BigNumber.ROUND_DOWN)),
      unit: 'K',
    }
  }
  return {
    value: eraseDecimal(bn.toFixed(toFix, BigNumber.ROUND_DOWN)),
    unit: '',
  }
}

const getPriceChange = ({
  from,
  to,
}: {
  from: BigNumber
  to: BigNumber
}): {
  isIncreased: boolean
  rate: BigNumber
} => {
  const isIncreased = to.isGreaterThanOrEqualTo(from)
  const rate = isIncreased
    ? to.div(from).minus(1)
    : new BigNumber(1).minus(to.div(from))
  return {
    isIncreased,
    rate,
  }
}

const toBase64 = (value: string): string =>
  Buffer.from(value).toString('base64')

const fromBase64 = (value: string): string =>
  Buffer.from(value, 'base64').toString()

const formatPercentage = (per: BigNumber): string => {
  return per.lt(0.01)
    ? '<0.01'
    : per.gt(99.9)
    ? '>99.9'
    : per.multipliedBy(100).toFixed(2)
}

const noUndefinedObj = <T extends object & { length?: never }>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)) as T
}

const isValidPrice = (price: Token): boolean => {
  return !!price && isNumberString(price) && Number(price) !== 0
}

const toBoolean = (str: string): boolean => {
  return str.trim().toLowerCase() === 'true'
}

export default {
  getContrastColor,
  findColorNameFromPalette,
  replaceAll,
  unescape,
  formatHex,
  isMainnet,
  chainIdToSupportedNetworkEnum,
  compareContractAddr,
  parseJwt,
  filterUndefined,
  getTokenBalanceInUSD,
  getNetworkLogo,
  truncate,
  jsonTryParse,
  setComma,
  delComma,
  extractNumber,
  isNumberString,
  toBn,
  isEven,
  isOdd,
  microfyU2P,
  microfyU,
  microfyP,
  demicrofyU,
  demicrofyP,
  formatAmountU,
  formatAmountP,
  abbreviateNumber,
  getPriceChange,
  toBase64,
  fromBase64,
  formatPercentage,
  noUndefinedObj,
  isValidPrice,
  toBoolean,
}
