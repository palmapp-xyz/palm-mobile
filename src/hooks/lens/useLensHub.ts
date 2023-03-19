import { useMemo, useState } from 'react'

import lensHubAbi from '../../abi/lens-hub-contract-abi.json'
import lensPeripheryAbi from '../../abi/lens-periphery-data-provider.json'

import { SupportedNetworkEnum } from 'types'
import useNetwork from 'hooks/complex/useNetwork'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import { ethers } from 'ethers'
import useEthers from 'hooks/complex/useEthers'
import useSetting from 'hooks/independent/useSetting'

export type UseLensHubReturn = {
  lensHub: ethers.Contract | undefined
  lensPeriphery: ethers.Contract | undefined
}

const useLensHub = (chain: SupportedNetworkEnum): UseLensHubReturn => {
  const { contractMap } = useNetwork()
  const { setting } = useSetting()
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
  }, [setting.network])

  return {
    lensHub,
    lensPeriphery,
  }
}

export default useLensHub
