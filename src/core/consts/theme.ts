import { ThemeType } from 'core/types'

export const light: ThemeType = {
  main: {
    _100: '#EBD4FD',
    _200: '#D5ABFB',
    _300: '#B87FF4',
    _400: '#9C5EEA',
    _500: '#742DDD',
    _600: '#5920BE',
    _700: '#42169F',
    _800: '#2E0E80',
    _900: '#1F086A',
  },
  gray: {
    white: '#FFFFFF',
    _30: '#FAFAFA',
    _50: '#F4F4F6',
    _70: '#ECECEF',
    _100: '#E3E4E8',
    _200: '#D8DADE',
    _300: '#C8CAD0',
    _400: '#B4B7C0',
    _500: '#8F939F',
    _600: '#70727C',
    _700: '#4C4E54',
    _800: '#3F4146',
    _830: '#323438',
    _850: '#2B2C30',
    _870: '#232427',
    _900: '#191A1C',
  },
  red: {
    solid: '#F84F4F',
    pale: '#FFE6E6',
  },
  secondary: {
    solid: '#8BDF15',
    pale: '#F4FFE6',
  },
  blue: {
    solid: '#6461FF',
    pale: '#E8E8FF',
  },
  orange: {
    solid: '#FF8A1E',
    pale: '#FFEFD7',
  },
  purple: {
    solid: '#D258ED',
    pale: '#FBE8FF',
  },
  yellow: {
    solid: '#FCDA54',
    pale: '#FFF9E3',
  },
}

export const dark: ThemeType = {
  main: {
    _100: light.main._900,
    _200: light.main._800,
    _300: light.main._700,
    _400: light.main._600,
    _500: light.main._500,
    _600: light.main._400,
    _700: light.main._300,
    _800: light.main._200,
    _900: light.main._100,
  },
  gray: {
    white: light.gray._900,
    _30: light.gray._870,
    _50: light.gray._850,
    _70: light.gray._830,
    _100: light.gray._800,
    _200: light.gray._700,
    _300: light.gray._600,
    _400: light.gray._500,
    _500: light.gray._400,
    _600: light.gray._300,
    _700: light.gray._200,
    _800: light.gray._100,
    _830: light.gray._70,
    _850: light.gray._50,
    _870: light.gray._30,
    _900: light.gray.white,
  },
  red: {
    solid: '#F84F4F',
    pale: '#2C0101',
  },
  secondary: {
    solid: '#8BDF15',
    pale: '#243C02',
  },
  blue: {
    solid: '#6461FF',
    pale: '#0C012C',
  },
  orange: {
    solid: '#FF8A1E',
    pale: '#321901',
  },
  purple: {
    solid: '#D258ED',
    pale: '#200127',
  },
  yellow: {
    solid: '#FCDA54',
    pale: '#251E01',
  },
}
