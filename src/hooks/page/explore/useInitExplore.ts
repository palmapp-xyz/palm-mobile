import images from 'assets/images'
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
    img: require('assets/temp/thumbs1.png'),
    title: 'ABC',
  },
  {
    id: '7',
    img: require('assets/temp/thumbs2.png'),
    title: 'doggy club',
  },
  {
    id: '8',
    img: require('assets/temp/thumbs3.png'),
    title: 'Owls',
  },
  {
    id: '9',
    img: require('assets/temp/thumbs4.png'),
    title: 'Doodle it!',
  },
  {
    id: '10',
    img: require('assets/temp/thumbs5.png'),
    title: 'cyonic club',
  },
  {
    id: '11',
    img: require('assets/temp/thumbs6.png'),
    title: 'This is never that',
  },
  {
    id: '12',
    img: require('assets/temp/thumbs7.png'),
    title: 'Dino',
  },
  {
    id: '13',
    img: require('assets/temp/thumbs8.png'),
    title: 'NFT collection sample1',
  },
  {
    id: '14',
    img: require('assets/temp/thumbs9.png'),
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
