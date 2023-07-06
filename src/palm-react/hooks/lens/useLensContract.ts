import lensHub from 'palm-core/abi/lens-hub-contract-abi.json'
import { Scalars } from 'palm-core/graphqls'
import { contractMap } from 'palm-core/libs/network'
import {
  ContractAddr,
  EncodedTxData,
  SupportedNetworkEnum,
} from 'palm-core/types'
import useContract from 'palm-react/hooks/complex/useContract'
import { AbiItem } from 'web3-utils'

import { Maybe } from '@toruslabs/openlogin'

export type UseLensContractReturn = {
  lensHubContract: ContractAddr
  getProfileMetadataURI: (props: {
    profileId: number
  }) => Promise<Maybe<Scalars['Url']>>
  setProfileMetadataURI: (props: {
    profileId: number
    metadata: string
  }) => Maybe<EncodedTxData>
  setProfileMetadataURIWithSig: (props: {
    profileId: number
    metadata: string
    sig: {
      v: number
      r: string
      s: string
      deadline: number
    }
  }) => Maybe<EncodedTxData>
  toggleFollow: (props: {
    profileIds: number[]
    enables: boolean[]
  }) => Maybe<EncodedTxData>
  toggleFollowWithSig: (props: {
    follower: ContractAddr
    profileIds: number[]
    enables: boolean[]
    sig: {
      v: number
      r: string
      s: string
      deadline: number
    }
  }) => Maybe<EncodedTxData>
}

const useLensContract = (
  chain: SupportedNetworkEnum
): UseLensContractReturn => {
  const lensHubContract = contractMap(chain).lens_hub!

  const { callMethod, getEncodedTxData } = useContract({
    abi: lensHub as AbiItem[],
    contractAddress: lensHubContract!,
    chain,
  })

  const getProfileMetadataURI = async ({
    profileId,
  }: {
    profileId: number
  }): Promise<Maybe<Scalars['Url']>> =>
    callMethod<Scalars['Url']>('getProfileMetadataURI', [profileId])

  const setProfileMetadataURI = ({
    profileId,
    metadata,
  }: {
    profileId: number
    metadata: string
  }): Maybe<EncodedTxData> =>
    getEncodedTxData('setProfileMetadataURI', [profileId, metadata])

  const setProfileMetadataURIWithSig = ({
    profileId,
    metadata,
    sig,
  }: {
    profileId: number
    metadata: string
    sig: {
      v: number
      r: string
      s: string
      deadline: number
    }
  }): Maybe<EncodedTxData> =>
    getEncodedTxData('setProfileMetadataURIWithSig', [profileId, metadata, sig])

  const toggleFollow = ({
    profileIds,
    enables,
  }: {
    profileIds: number[]
    enables: boolean[]
  }): Maybe<EncodedTxData> =>
    getEncodedTxData('toggleFollow', [profileIds, enables])

  const toggleFollowWithSig = ({
    follower,
    profileIds,
    enables,
    sig,
  }: {
    follower: ContractAddr
    profileIds: number[]
    enables: boolean[]
    sig: {
      v: number
      r: string
      s: string
      deadline: number
    }
  }): Maybe<EncodedTxData> =>
    getEncodedTxData('toggleFollowWithSig', [
      follower,
      profileIds,
      enables,
      sig,
    ])

  return {
    lensHubContract,
    getProfileMetadataURI,
    setProfileMetadataURI,
    setProfileMetadataURIWithSig,
    toggleFollow,
    toggleFollowWithSig,
  }
}

export default useLensContract
