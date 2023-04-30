import { useCallback } from 'react'
import { ContractAddr, EncodedTxData, SupportedNetworkEnum } from 'types'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import useWeb3 from './useWeb3'

type UseContractReturn = {
  contract?: Contract
  getEncodedTxData: (
    methodName: string,
    params?: any
  ) => EncodedTxData | undefined
  callMethod: <R>(methodName: string, params?: any[]) => Promise<R | undefined>
}

const useContract = ({
  contractAddress,
  abi,
  chain,
}: {
  contractAddress: ContractAddr
  abi: AbiItem[]
  chain: SupportedNetworkEnum
}): UseContractReturn => {
  const { web3 } = useWeb3(chain)

  const contract = web3 && new web3.eth.Contract(abi, contractAddress)

  const getEncodedTxData = useCallback(
    (methodName: string, params?: any) => {
      const jsonInterface = contract?.options.jsonInterface.find(
        x => x.name === methodName
      )

      if (jsonInterface && web3) {
        return web3.eth.abi.encodeFunctionCall(
          jsonInterface,
          params
        ) as EncodedTxData
      }
    },
    [contract, web3]
  )

  const callMethod = async <R>(
    methodName: string,
    params?: any[]
  ): Promise<R | undefined> => {
    if (contract) {
      const method = contract.methods[methodName]
      const target = params ? method(...params) : method()
      return target.call() as R
    }
  }

  return {
    contract,
    getEncodedTxData,
    callMethod,
  }
}

export default useContract
