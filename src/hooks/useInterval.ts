import { useEffect, useRef } from 'react'

const useInterval = (callback: () => void, interval: number | null): void => {
  const savedCallback = useRef<(() => void) | null>(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (!interval && interval !== 0) {
      return
    }

    const id = setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }, interval)
    return () => clearInterval(id)
  }, [interval])
}

export default useInterval
