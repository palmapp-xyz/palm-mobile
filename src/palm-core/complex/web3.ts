import _ from 'lodash'
import { NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import {
  ChainNetworkEnum,
  ContractAddr,
  PostTxReturn,
  PostTxStatus,
  pToken,
  StreamResultType,
  SupportedNetworkEnum,
} from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import Web3 from 'web3'
import { Account, TransactionConfig, TransactionReceipt } from 'web3-core'

const gas = 300000

class Web3Account {
  chain: SupportedNetworkEnum
  web3: Web3
  onPostTxResult?: (result: StreamResultType) => Promise<void>
  signer?: Account

  constructor(
    chain: SupportedNetworkEnum,
    onPostTxResult?: (result: StreamResultType) => Promise<void>
  ) {
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

    this.onPostTxResult = onPostTxResult
  }

  setOnPostTxResult = (
    onPostTxResult?: (result: StreamResultType) => Promise<void>
  ): void => {
    this.onPostTxResult = onPostTxResult
  }

  getSigner = async (): Promise<Account | undefined> => {
    if (this.signer) {
      return this.signer
    }

    const pKey = await PkeyManager.getPkey()
    let ret: Account | undefined
    if (pKey) {
      ret = await this.web3.eth.accounts.privateKeyToAccount(pKey)
      this.signer = ret
    }
    return ret
  }

  getNonce = async (userAddress: ContractAddr): Promise<number> => {
    return this.web3.eth.getTransactionCount(userAddress, 'latest')
  }

  getBalance = async (userAddress: ContractAddr): Promise<string> => {
    return this.web3.eth.getBalance(userAddress)
  }

  sendTransaction = async (
    from: ContractAddr,
    to: ContractAddr,
    value: pToken
  ): Promise<TransactionReceipt | undefined> => {
    const pKey = await PkeyManager.getPkey()
    if (!pKey) {
      return undefined
    }
    const nonce = await this.getNonce(from)
    const transaction: TransactionConfig = {
      to,
      value,
      gas: 30000,
      nonce,
    }
    const signedTx = await this.web3.eth.accounts.signTransaction(
      transaction,
      pKey
    )
    if (!signedTx.rawTransaction) {
      return undefined
    }

    const receipt = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      (error, transactionHash) => {
        if (error) {
          this.onPostTxResult?.({
            status: PostTxStatus.ERROR,
            error: error?.message ? error.message : JSON.stringify(error),
            chain: this.chain,
          })
          return
        }

        this.onPostTxResult?.({
          status: PostTxStatus.BROADCAST,
          transactionHash,
          chain: this.chain,
        })
      }
    )

    this.onPostTxResult?.({
      status: PostTxStatus.DONE,
      value: receipt,
      chain: this.chain,
    })

    return receipt
  }

  getTxFee = async ({
    from,
    to,
    value,
  }: {
    from: ContractAddr
    to: ContractAddr
    value: pToken
  }): Promise<pToken> => {
    const estimated = await this.web3.eth.estimateGas({
      from,
      to,
      gas,
      value,
    })
    const price = await this.web3.eth.getGasPrice()
    return UTIL.toBn(estimated).multipliedBy(price).toString(10) as pToken
  }

  postTx = async ({
    from,
    to,
    value,
  }: {
    from: ContractAddr
    to: ContractAddr
    value: pToken
  }): Promise<PostTxReturn> => {
    this.onPostTxResult?.({ status: PostTxStatus.POST, chain: this.chain })
    try {
      const pkey = await PkeyManager.getPkey()
      const account = this.web3.eth.accounts.privateKeyToAccount(pkey)
      this.web3.eth.accounts.wallet.add(account)

      const receipt = await this.web3.eth
        .sendTransaction({
          from,
          to,
          gas,
          value,
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

export default Web3Account
