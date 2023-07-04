import { ethers } from 'ethers'
import lensHubAbi from 'palm-core/abi/lens-hub-contract-abi.json'
import lensPeripheryAbi from 'palm-core/abi/lens-periphery-data-provider.json'
import { SupportedNetworkEnum } from 'palm-core/types'
import useEthers from 'palm-react/hooks/complex/useEthers'
import useNetwork from 'palm-react/hooks/complex/useNetwork'
import { useMemo, useState } from 'react'

import { useAsyncEffect } from '@sendbird/uikit-utils'

export type UseLensHubReturn = {
  lensHub: ethers.Contract | undefined
  lensPeriphery: ethers.Contract | undefined
}

const useLensHub = (chain: SupportedNetworkEnum): UseLensHubReturn => {
  const { contractMap } = useNetwork()
  const { getSigner } = useEthers()
  const [lensHubContract, lensPeripheryContract] = useMemo(
    () => [contractMap[chain].lens_hub!, contractMap[chain].lens_periphery!],
    [contractMap]
  )
  const [lensHub, setLensHub] = useState<ethers.Contract>()
  const [lensPeriphery, setLensPeriphery] = useState<ethers.Contract>()

  useAsyncEffect(async () => {
    const signer = await getSigner(SupportedNetworkEnum.POLYGON)
    if (signer) {
      setLensHub(new ethers.Contract(lensHubContract, lensHubAbi, signer))
      setLensPeriphery(
        new ethers.Contract(lensPeripheryContract, lensPeripheryAbi, signer)
      )
    }
  }, [])

  return {
    lensHub,
    lensPeriphery,
  }
}

export default useLensHub
