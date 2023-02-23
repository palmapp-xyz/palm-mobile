import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import groupChannelStore from 'store/groupChannelStore'
import { Moralis } from 'types'

export type UseGcReturn = {
  selectedNft?: Moralis.NftItem
  setSelectedNft: (value?: Moralis.NftItem) => void
  visibleModal?: VisibleModalType
  setVisibleModal: (value?: VisibleModalType) => void
  initData: () => void
}

type VisibleModalType = 'sell' | 'send'

const useGc = (): UseGcReturn => {
  const [visibleModal, setVisibleModal] = useRecoilState(
    groupChannelStore.visibleModal
  )
  const [selectedNft, setSelectedNft] = useRecoilState(
    groupChannelStore.selectedNft
  )

  const initData = (): void => {
    setSelectedNft(undefined)
    setVisibleModal(undefined)
  }

  useEffect(() => {
    return initData
  }, [])

  return {
    visibleModal,
    setVisibleModal,
    selectedNft,
    setSelectedNft,
    initData,
  }
}

export default useGc
