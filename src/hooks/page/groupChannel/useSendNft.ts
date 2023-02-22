import { useMemo, useState } from 'react'

// import { UTIL } from 'consts'

import { ApiEnum, ContractAddr, Moralis, PostTxStatus } from 'types'
import usePostTx from 'hooks/complex/usePostTx'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
// import useExplorer from 'hooks/complex/useExplorer'
import usePostTxStatusEffect, {
  EffectListType,
} from 'hooks/independent/usePostTxStatusEffect'

import { GroupChannel } from '@sendbird/chat/groupChannel'
import { ItemType } from 'react-native-dropdown-picker'
import { useSetRecoilState } from 'recoil'
import groupChannelStore from 'store/groupChannelStore'
import { useQueryClient } from 'react-query'

export type UseSendNftReturn = {
  isPosting: boolean
  receiverList: ItemType<string>[]
  setReceiverList: React.Dispatch<React.SetStateAction<ItemType<string>[]>>
  receiver: ContractAddr
  setReceiver: React.Dispatch<React.SetStateAction<ContractAddr>>
  onClickConfirm: () => Promise<void>
  isValidForm: boolean
}

const useSendNft = ({
  selectedNft,
  channel,
}: {
  selectedNft: Moralis.NftItem
  channel: GroupChannel
}): UseSendNftReturn => {
  const setVisibleModal = useSetRecoilState(groupChannelStore.visibleModal)

  const [isPosting, setIsPosting] = useState(false)

  const { user } = useAuth()
  const initReceiverList: ItemType<string>[] = useMemo(
    () =>
      channel.members
        .filter(x => x.userId !== user?.address)
        .map(x => ({
          label: x.nickname,
          value: x.userId,
        })),
    [channel.members, user?.address]
  )
  const [receiverList, setReceiverList] = useState(initReceiverList)
  const [receiver, setReceiver] = useState<ContractAddr>('' as ContractAddr)

  const { transferFromData } = useNft({
    nftContract: selectedNft?.token_address,
  })

  const { postTx } = usePostTx({ contractAddress: selectedNft.token_address })

  const queyrClient = useQueryClient()

  const isValidForm = !!receiver

  const onClickConfirm = async (): Promise<void> => {
    if (user?.address) {
      const data = transferFromData({
        from: user.address,
        to: receiver,
        tokenId: selectedNft.token_id,
      })

      setVisibleModal(undefined)
      postTx({ data })
    }
  }

  const effectList: EffectListType = useMemo(
    () => [
      // {
      //   when: [PostTxStatus.POST],
      //   action: (): void => {
      //     setIsPosting(true)
      //   },
      // },
      {
        when: [PostTxStatus.BROADCAST],
        action: async (act): Promise<void> => {
          if (user && act.status === PostTxStatus.BROADCAST && isPosting) {
            // await showImage(selectedNft.token_uri)
            // const hash = act.transactionHash
            // await sendMessage(
            //   `${UTIL.truncate(
            //     user.address
            //   )} is trying to send a NFT to ${UTIL.truncate(receiver)}\nID : ${
            //     selectedNft.token_id
            //   }`
            // )
            // await sendLink(
            //   getLink({ address: hash, type: 'tx' }),
            //   UTIL.truncate(hash)
            // )
          }
        },
      },
      {
        when: [PostTxStatus.DONE, PostTxStatus.ERROR],
        action: (): void => {
          setIsPosting(false)
          queyrClient.removeQueries([ApiEnum.ASSETS])
        },
      },
    ],
    [user, isPosting]
  )
  usePostTxStatusEffect({ effectList })

  return {
    isPosting,
    receiverList,
    setReceiverList,
    receiver,
    setReceiver,
    onClickConfirm,
    isValidForm,
  }
}

export default useSendNft
