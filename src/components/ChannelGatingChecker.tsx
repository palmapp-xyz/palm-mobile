import React, { ReactElement, useEffect } from 'react'
import { useMemo } from 'react'

import { UTIL } from 'consts'

import {
  FbChannelGatingField,
  FbChannelNativeGatingField,
  FbChannelNFTGatingField,
  QueryKeyEnum,
} from 'types'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useReactQuery from 'hooks/complex/useReactQuery'
import useAuth from 'hooks/auth/useAuth'
import useNft from 'hooks/contract/useNft'
import useUserBalance from 'hooks/independent/useUserBalance'

const NftChecker = ({
  gating,
  onCompleteCheck,
}: {
  gating: FbChannelNFTGatingField
  onCompleteCheck: (props: {
    accessible: boolean
    gating: FbChannelGatingField
  }) => void
}): ReactElement => {
  const { user } = useAuth()
  const { balanceOf } = useNft({
    nftContract: gating.tokenAddress,
    chain: gating.chain,
  })
  const { data: balance, isLoading } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_BALANCE_OF, gating.chain],
    async () => {
      if (user) {
        return (await balanceOf({ owner: user.address })) || '0'
      }
    }
  )

  useEffect(() => {
    if (balance && isLoading === false) {
      onCompleteCheck({
        accessible: UTIL.toBn(balance).gte(gating.amount),
        gating,
      })
    }
  }, [isLoading, balance])
  return <></>
}

const NativeChecker = ({
  gating,
  onCompleteCheck,
}: {
  gating: FbChannelNativeGatingField
  onCompleteCheck: (props: {
    accessible: boolean
    gating: FbChannelGatingField
  }) => void
}): ReactElement => {
  const { user } = useAuth()
  const { balance, isLoading } = useUserBalance({
    address: user?.address,
    chain: gating.chain,
  })

  useEffect(() => {
    if (balance && isLoading === false) {
      onCompleteCheck({
        accessible: UTIL.toBn(UTIL.demicrofyP(balance)).gte(gating.amount),
        gating,
      })
    }
  }, [isLoading, balance])
  return <></>
}

const ChannelGatingChecker = ({
  channelUrl,
  onCompleteCheck,
}: {
  channelUrl: string
  onCompleteCheck: (props: {
    accessible: boolean
    gating: FbChannelGatingField
  }) => void
}): ReactElement => {
  const { fsChannelField } = useFsChannel({ channelUrl })
  const gating = useMemo(() => fsChannelField?.gating, [fsChannelField])

  return (
    <>
      {!!gating && (
        <>
          {gating.gatingType === 'Native' ? (
            <NativeChecker gating={gating} onCompleteCheck={onCompleteCheck} />
          ) : gating.gatingType === 'NFT' ? (
            <NftChecker gating={gating} onCompleteCheck={onCompleteCheck} />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  )
}

export default ChannelGatingChecker
