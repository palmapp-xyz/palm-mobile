export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        // eslint-disable-next-line prettier/prettier
        (ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}
