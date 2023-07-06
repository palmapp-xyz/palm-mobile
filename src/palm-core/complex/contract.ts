import _ from 'lodash'
import { NETWORK } from 'palm-core/consts'
import {
  ChainNetworkEnum,
  ContractAddr,
  EncodedTxData,
  PostTxReturn,
  PostTxStatus,
  pToken,
  StreamResultType,
  SupportedNetworkEnum,
} from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { UTIL } from '../libs'

const gas = 300000

export type Web3ContractProps = {
  contractAddress: ContractAddr
  abi: AbiItem[]
  chain: SupportedNetworkEnum
  onPostTxResult?: (result: StreamResultType) => Promise<void>
}

class Web3Contract {
  chain: SupportedNetworkEnum
  web3: Web3
  contract: any
  onPostTxResult?: (result: StreamResultType) => Promise<void>

  constructor({
    contractAddress,
    abi,
    chain,
    onPostTxResult,
  }: Web3ContractProps) {
    this.chain = chain

    const mainnet = UTIL.isMainnet()
    this.web3 = new Web3(
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
    )

    this.contract = new this.web3.eth.Contract(abi, contractAddress)

    this.onPostTxResult = onPostTxResult
  }

  getEncodedTxData = (methodName: string, params?: any): EncodedTxData => {
    const jsonInterface = this.contract.options.jsonInterface.find(
      x => x.name === methodName
    )

    if (!jsonInterface) {
      throw new Error(`Cannot find method ${methodName}`)
    }

    return this.web3.eth.abi.encodeFunctionCall(
      jsonInterface,
      params
    ) as EncodedTxData
  }

  callMethod = async <R>(
    methodName: string,
    params?: any[]
  ): Promise<R | undefined> => {
    const method = this.contract.methods[methodName]
    const target = params ? method(...params) : method()
    return target.call() as R
  }

  getTxFee = async ({
    from,
    data,
  }: {
    from: ContractAddr
    data: EncodedTxData
  }): Promise<pToken> => {
    const estimated = await this.web3.eth.estimateGas({
      from,
      to: this.contract.address,
      gas,
      data,
    })
    const price = await this.web3.eth.getGasPrice()
    return UTIL.toBn(estimated).multipliedBy(price).toString(10) as pToken
  }

  postTx = async ({
    from,
    data,
  }: {
    from: ContractAddr
    data: EncodedTxData
  }): Promise<PostTxReturn> => {
    if (_.isEmpty(data)) {
      const message = 'Post data is empty'
      return {
        success: false,
        message,
      }
    }

    this.onPostTxResult?.({ status: PostTxStatus.POST, chain: this.chain })
    try {
      const pkey = await PkeyManager.getPkey()
      const account = this.web3.eth.accounts.privateKeyToAccount(pkey)
      this.web3.eth.accounts.wallet.add(account)

      const receipt = await this.web3.eth
        .sendTransaction({
          from,
          to: this.contract.address,
          gas,
          data,
        })
        .on('transactionHash', transactionHash => {
          this.onPostTxResult?.({
            status: PostTxStatus.BROADCAST,
            transactionHash,
            chain: this.chain,
          })
        })

      this.onPostTxResult?.({
        status: PostTxStatus.DONE,
        value: receipt,
        chain: this.chain,
      })
      return {
        success: true,
        receipt,
      }
    } catch (error: any) {
      this.onPostTxResult?.({
        status: PostTxStatus.ERROR,
        error: error?.message ? error.message : JSON.stringify(error),
        chain: this.chain,
      })
      return {
        success: false,
        message: _.toString(error),
        error,
      }
    }
  }
}

export default Web3Contract
