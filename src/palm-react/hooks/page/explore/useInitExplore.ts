import images from 'palm-ui-kit/assets/images'
import { useState } from 'react'

export type UseInitExploreReturn = {
  interestList: InterestItem[]
  selectedInterestList: string[]
  updateSelectedInterestList: (value: string) => void
}

export type InterestItem = {
  id: string
  img?: any
  title: string
}
const interestList: InterestItem[] = [
  { id: '1', img: images.klay_logo, title: 'KLAY' },
  { id: '2', img: images.eth_logo, title: 'ETH' },
  { id: '3', img: images.matic_logo, title: 'MATIC' },
  { id: '4', title: '#gogoKlay' },
  { id: '5', title: '#stop falling' },
  {
    id: '6',
    img: images.samples[0],
    title: 'ABC',
  },
  {
    id: '7',
    img: images.samples[1],
    title: 'doggy club',
  },
  {
    id: '8',
    img: images.samples[2],
    title: 'Owls',
  },
  {
    id: '9',
    img: images.samples[3],
    title: 'Doodle it!',
  },
  {
    id: '10',
    img: images.samples[4],
    title: 'cyonic club',
  },
  {
    id: '11',
    img: images.samples[5],
    title: 'This is never that',
  },
  {
    id: '12',
    img: images.samples[6],
    title: 'Dino',
  },
  {
    id: '13',
    img: images.samples[7],
    title: 'NFT collection sample1',
  },
  {
    id: '14',
    img: images.samples[8],
    title: 'sample2',
  },
]

const useInitExplore = (): UseInitExploreReturn => {
  const [selectedInterestList, setSelectedInterestList] = useState<string[]>([])

  const updateSelectedInterestList = (value: string): void => {
    setSelectedInterestList(ori => {
      const newList = [...ori]
      return newList.includes(value)
        ? newList.filter(x => x !== value)
        : newList.concat(value)
    })
  }

  return {
    interestList,
    selectedInterestList,
    updateSelectedInterestList,
  }
}

export default useInitExplore
