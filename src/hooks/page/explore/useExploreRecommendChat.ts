export type UseExploreRecommendChatReturn = {
  chatList: ChatItem[]
}

export type ChatItem = {
  id: string
  users: { img: any }[]
  title: string
  tagList: string[]
  gatingToken?: {
    img: any
    amount: number
    tokenName: string
  }
}
const chatList: ChatItem[] = [
  {
    id: '1',
    users: [
      {
        img: require('assets/temp/thumbs1.png'),
      },
      {
        img: require('assets/temp/thumbs2.png'),
      },
    ],
    title:
      'Chat room name here Chat room name here Chat room 123 ABCD Chat room name here Chat room name here Chat room 123 ABCD ',
    tagList: ['sample tag1', 'tag2', 'sample', 'sample tag3'],
    gatingToken: {
      img: require('assets/temp/thumbs2.png'),
      amount: 1,
      tokenName: 'Dodododliii',
    },
  },

  {
    id: '1',
    users: [
      {
        img: require('assets/temp/thumbs3.png'),
      },
      {
        img: require('assets/temp/thumbs4.png'),
      },
      {
        img: require('assets/temp/thumbs1.png'),
      },
      {
        img: require('assets/temp/thumbs2.png'),
      },
      {
        img: require('assets/temp/thumbs8.png'),
      },
      {
        img: require('assets/temp/thumbs9.png'),
      },
    ],
    title:
      'Chat room name here Chat room name here Chat room 123 ABCD Chat room name here Chat room name here Chat room 123 ABCD ',
    tagList: ['sample tag1', 'tag2', 'sample', 'sample tag3'],
    gatingToken: {
      img: require('assets/temp/thumbs5.png'),
      amount: 2,
      tokenName: '324242',
    },
  },

  {
    id: '3',
    users: [
      {
        img: require('assets/temp/thumbs6.png'),
      },
      {
        img: require('assets/temp/thumbs7.png'),
      },
    ],
    title:
      'Chat room name here Chat room name here Chat room 123 ABCD Chat room name here Chat room name here Chat room 123 ABCD ',
    tagList: ['sample tag1', 'tag2', 'sample', 'sample tag3'],
  },
]

const useExploreRecommendChat = (): UseExploreRecommendChatReturn => {
  return {
    chatList,
  }
}

export default useExploreRecommendChat
