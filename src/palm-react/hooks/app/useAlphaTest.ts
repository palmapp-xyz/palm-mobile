import { useEffect, useState } from 'react'

type AlphaConfig = {
  waitlist: boolean
}

/* Hook used only in alpha test
 * 1. fetch config.json from github assets
 * 2. fetch waitlist.json from github assets
 * 3. return config and waitlist
 */
const useAlphaTest = (): {
  config: AlphaConfig | undefined
  waitList: string[] | undefined
} => {
  const [config, setConfig] = useState<AlphaConfig | undefined>(undefined)
  const [waitList, setWaitList] = useState<string[] | undefined>(undefined)

  const fetchWithTimeout = async (
    url: string,
    timeout: number
  ): Promise<Response> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  const fetchConfig = async (): Promise<void> => {
    try {
      const ret = await fetchWithTimeout(
        'https://raw.githubusercontent.com/palmapp-xyz/assets/main/mobile/alpha/config.json',
        5000
      )

      if (ret.ok) {
        setConfig((await ret.json()) as AlphaConfig)
      } else {
        setConfig({ waitlist: false })
      }
    } catch (e) {
      setConfig({ waitlist: false })
      console.error(e)
    }

    // setConfig({ waitlist: true })
  }

  const fetchWaitList = async (): Promise<void> => {
    try {
      const ret = await fetchWithTimeout(
        'https://raw.githubusercontent.com/palmapp-xyz/assets/main/mobile/alpha/waitlist.json',
        5000
      )

      if (ret.ok) {
        const list = await ret.json()
        setWaitList(list.map((s: string) => s.toLowerCase()))
      } else {
        setWaitList([])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  useEffect(() => {
    if (config?.waitlist) {
      fetchWaitList()
    }
  }, [config])

  return {
    config,
    waitList,
  }
}

export default useAlphaTest
