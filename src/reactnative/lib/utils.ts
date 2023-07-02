import { URL } from 'react-native-url-polyfill'

export const isValidHttpUrl = (src: string | undefined): boolean => {
  if (!src) {
    return false
  }

  let url
  try {
    url = new URL(src)
  } catch {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
