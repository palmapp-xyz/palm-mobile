export type ThemeModeType = 'dark' | 'light'

export type MainThemeType = {
  _100: string
  _200: string
  _300: string
  _400: string
  _500: string
  _600: string
  _700: string
  _800: string
  _900: string
}

export type GrayThemeType = {
  white: string
  _30: string
  _50: string
  _70: string
  _100: string
  _200: string
  _300: string
  _400: string
  _500: string
  _600: string
  _700: string
  _800: string
  _830: string
  _850: string
  _870: string
  _900: string
}

export type ColorDefaultThemeType = {
  solid: string
  pale: string
}

export type ThemeType = {
  main: MainThemeType
  gray: GrayThemeType
  red: ColorDefaultThemeType
  secondary: ColorDefaultThemeType
  blue: ColorDefaultThemeType
  orange: ColorDefaultThemeType
  purple: ColorDefaultThemeType
  yellow: ColorDefaultThemeType
}
