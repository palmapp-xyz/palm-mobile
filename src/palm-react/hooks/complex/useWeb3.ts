import { NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import {
  ChainNetworkEnum,
  ContractAddr,
  PostTxStatus,
  pToken,
  SupportedNetworkEnum,
} from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import postTxStore from 'palm-react/store/postTxStore'
import { useMemo } from 'react'
import { useSetRecoilState } from 'recoil'
import Web3 from 'web3'
import { Account, TransactionConfig, TransactionReceipt } from 'web3-core'

type UseWeb3Return = {
  web3: Web3
  getSigner: () => Promise<Account | undefined>
  getNonce: (userAddress: ContractAddr) => Promise<number>
  sendTransaction: (
    from: ContractAddr,
    to: ContractAddr,
    value: pToken
  ) => Promise<TransactionReceipt | undefined>
}

const useWeb3 = (chain: SupportedNetworkEnum): UseWeb3Return => {
  const mainnet = UTIL.isMainnet()

  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const web3 = useMemo(
    () =>
      new Web3(
        NETWORK.chainParam[
          chain === SupportedNetworkEnum.KLAYTN
            ? mainnet
              ? ChainNetworkEnum.CYPRESS
              : ChainNetworkEnum.BAOBAB
            : chain === SupportedNetworkEnum.POLYGON
            ? mainnet
              ? ChainNetworkEnum.POLYGON
              : ChainNetworkEnum.MUMBAI
            : mainnet
            ? ChainNetworkEnum.ETHEREUM
            : ChainNetworkEnum.GOERLI
        ].rpcUrls[0]
      ),
    [mainnet, chain]
  )

  const getSigner = async (): Promise<Account | undefined> => {
    const pKey = await PkeyManager.getPkey()
    if (pKey) {
      return web3.eth.accounts.privateKeyToAccount(pKey)
    }
  }

  const getNonce = async (userAddress: ContractAddr): Promise<number> => {
    return await web3.eth.getTransactionCount(userAddress, 'latest')
  }

  const sendTransaction = async (
    from: ContractAddr,
    to: ContractAddr,
    value: pToken
  ): Promise<TransactionReceipt | undefined> => {
    const pKey = await PkeyManager.getPkey()
    if (!pKey) {
      return undefined
    }
    const nonce = await getNonce(from)
    const transaction: TransactionConfig = {
      to,
      value,
      gas: 30000,
      nonce,
    }
    const signedTx = await web3.eth.accounts.signTransaction(transaction, pKey)
    if (!signedTx.rawTransaction) {
      return undefined
    }

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      (error, transactionHash) => {
        if (error) {
          setPostTxResult({
            status: PostTxStatus.ERROR,
            error: error?.message ? error.message : JSON.stringify(error),
            chain,
          })
          return
        }

        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash,
          chain,
        })
      }
    )

    setPostTxResult({
      status: PostTxStatus.DONE,
      value: receipt,
      chain,
    })

    return receipt
  }

  return {
    web3,
    getSigner,
    getNonce,
    sendTransaction,
  }
}

export default useWeb3
